import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculate as rectangleFits } from "../../game/grid-inventory-rectangle-fit-checker/tool.js";
import { matrixAsJson } from "../../matrix/as-json/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  requireDistinct,
  ensureOutput,
} from "../m250-css-music-space-support.js";
export type DashboardWidgetLayoutInput = {
  readonly rows: number;
  readonly columns: number;
  readonly widgets: readonly {
    readonly id: string;
    readonly widthCells: number;
    readonly heightCells: number;
  }[];
  readonly allowRotation: boolean;
  readonly maximumSearchNodes: number;
  readonly seed?: number;
};
export type DashboardWidgetLayoutOutput = {
  readonly placements: readonly {
    readonly id: string;
    readonly row: number;
    readonly column: number;
    readonly heightCells: number;
    readonly widthCells: number;
  }[];
  readonly occupancy: readonly (readonly number[])[];
  readonly occupancyJson: string;
  readonly exploredPlacements: number;
  readonly randomness: GeneratorReplay;
};
const widget = objectSchema({
  id: { type: "string", minLength: 1, maxLength: 64 },
  widthCells: countSchema(16),
  heightCells: countSchema(16),
});
export const inputSchema = objectSchema(
  {
    rows: countSchema(16),
    columns: countSchema(16),
    widgets: arraySchema(widget, 12, 1),
    allowRotation: { type: "boolean" },
    maximumSearchNodes: countSchema(20000),
    seed: generatorSeedSchema,
  },
  ["rows", "columns", "widgets", "allowRotation", "maximumSearchNodes"],
);
export const outputSchema = objectSchema({
  placements: arraySchema(
    objectSchema({
      id: { type: "string" },
      row: countSchema(15, 0),
      column: countSchema(15, 0),
      heightCells: countSchema(16),
      widthCells: countSchema(16),
    }),
    12,
    1,
  ),
  occupancy: arraySchema(arraySchema(countSchema(12, 0), 16, 1), 16, 1),
  occupancyJson: { type: "string", maxLength: 4096 },
  exploredPlacements: countSchema(20000),
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is DashboardWidgetLayoutInput =>
  matchesModelInput(value, inputSchema);
export const calculateDashboardWidgetLayout = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DashboardWidgetLayoutOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    requireDistinct(
      input.widgets.map((w) => w.id),
      "widgets",
    );
    if (
      input.widgets.reduce((s, w) => s + w.widthCells * w.heightCells, 0) >
      input.rows * input.columns
    )
      simpleError(
        "widgets",
        "Total widget area exceeds the board.",
        "infeasible_packing",
      );
    const random = createGeneratorRandom(input.seed, context),
      order = random.shuffle(
        input.widgets.map((widget, index) => ({ widget, index })),
      );
    const board = Array.from({ length: input.rows }, () =>
        Array<number>(input.columns).fill(0),
      ),
      placements: DashboardWidgetLayoutOutput["placements"][number][] = [];
    let exploredPlacements = 0;
    const search = (depth: number): boolean => {
      if (depth === order.length) return true;
      const { widget, index } = order[depth];
      const fitting = rectangleFits({
        occupiedCellBoard: board.map((row) =>
          row.map((cell) => (cell ? 1 : 0)),
        ),
        itemHeightCells: widget.heightCells,
        itemWidthCells: widget.widthCells,
        allowQuarterTurnRotation: input.allowRotation,
      });
      for (const move of random.shuffle(
        fitting.fittingPlacementsRowColumnHeightWidth,
      )) {
        if (exploredPlacements >= input.maximumSearchNodes)
          simpleError(
            "maximumSearchNodes",
            "Packing search reached its placement budget.",
            "search_exhausted",
          );
        exploredPlacements++;
        const [row, column, heightCells, widthCells] = move;
        for (let r = row; r < row + heightCells; r++)
          for (let c = column; c < column + widthCells; c++)
            board[r][c] = index + 1;
        placements.push({
          id: widget.id,
          row,
          column,
          heightCells,
          widthCells,
        });
        if (search(depth + 1)) return true;
        placements.pop();
        for (let r = row; r < row + heightCells; r++)
          for (let c = column; c < column + widthCells; c++) board[r][c] = 0;
      }
      return false;
    };
    if (!search(0))
      simpleError(
        "widgets",
        "Exhaustive bounded-grid search found no nonoverlapping placement.",
        "infeasible_packing",
      );
    const occupancyJson = matrixAsJson(board, 0);
    if (occupancyJson === null)
      throw new Error("Constructed board failed matrix serialization.");
    return toolSuccess(
      ensureOutput(
        {
          placements,
          occupancy: board,
          occupancyJson,
          exploredPlacements,
          randomness: generatorReplay(input.seed, context),
        },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dashboardWidgetLayoutExample = {
  input: {
    rows: 2,
    columns: 2,
    widgets: [
      {
        id: "a",
        widthCells: 2,
        heightCells: 1,
      },
      {
        id: "b",
        widthCells: 2,
        heightCells: 1,
      },
    ],
    allowRotation: false,
    maximumSearchNodes: 100,
    seed: 42,
  },
  output: {
    placements: [
      {
        id: "a",
        row: 1,
        column: 0,
        heightCells: 1,
        widthCells: 2,
      },
      {
        id: "b",
        row: 0,
        column: 0,
        heightCells: 1,
        widthCells: 2,
      },
    ],
    occupancy: [
      [2, 2],
      [1, 1],
    ],
    occupancyJson: "[[2,2],[1,1]]",
    exploredPlacements: 2,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DashboardWidgetLayoutInput,
  DashboardWidgetLayoutOutput
>;
export const dashboardWidgetLayoutTool = createModelDefinition<
  DashboardWidgetLayoutInput,
  DashboardWidgetLayoutOutput
>({
  id: "random/dashboard-widget-layout",
  title: "Random Dashboard Widget Layout Generator",
  description:
    "Pack supplied rectangular widgets into a cell grid with randomized bounded backtracking and validated nonoverlap placements.",
  inputSchema,
  outputSchema,
  execute: calculateDashboardWidgetLayout,
});
export const runDashboardWidgetLayout = dashboardWidgetLayoutTool.execute;
export default dashboardWidgetLayoutTool;
