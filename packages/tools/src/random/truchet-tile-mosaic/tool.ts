import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateRotate90 } from "../../matrix/rotate-90/tool.js";
import {
  fcArray,
  fcBoolean,
  fcBudget,
  fcChoices,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcRun,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type TruchetTile = {
  readonly motifId: string;
  readonly quarterTurns: number;
  readonly edges: readonly string[];
};
export type TruchetTileMosaicInput = FcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly motifs: readonly {
    readonly id: string;
    readonly edges: readonly string[];
    readonly quarterTurns: readonly number[];
  }[];
  readonly matchEdges: boolean;
  readonly outsideLabel: string;
};
export type TruchetTileMosaicOutput = FcReplay & {
  readonly grid: readonly (readonly TruchetTile[])[];
  readonly matchedNeighborPairs: number;
};
const edgeSchema = fcArray(fcId, 4, 4),
  tileSchema = fcObject({
    motifId: fcId,
    quarterTurns: fcInteger(0, 3),
    edges: edgeSchema,
  });
export const inputSchema = fcInput({
  rows: fcInteger(1, 16),
  columns: fcInteger(1, 16),
  motifs: fcArray(
    fcObject({
      id: fcId,
      edges: edgeSchema,
      quarterTurns: fcArray(fcInteger(0, 3), 4, 1),
    }),
    16,
    1,
  ),
  matchEdges: fcBoolean,
  outsideLabel: {
    type: "string",
    maxLength: 64,
    description:
      "Empty disables the outside constraint; otherwise every exposed edge must equal this label. Edges are N,E,S,W.",
  },
});
export const outputSchema = fcOutput({
  grid: fcArray(fcArray(tileSchema, 16, 1), 16, 1),
  matchedNeighborPairs: fcInteger(0, 480),
});
const isInput = (v: unknown): v is TruchetTileMosaicInput =>
  matchesModelInput(v, inputSchema);
export const calculateTruchetTileMosaic = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<TruchetTileMosaicOutput, "randomness"> => {
      fcUnique(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      const variants = x.motifs.flatMap((m) => {
        fcUnique(m.quarterTurns, "motifs." + m.id + ".quarterTurns");
        return m.quarterTurns.map((quarterTurns) => {
          let matrix: readonly (readonly number[])[] = [
            [-1, 0, -1],
            [3, -1, 1],
            [-1, 2, -1],
          ];
          for (let turn = 0; turn < quarterTurns; turn++)
            matrix = calculateRotate90({ matrix }).rotated;
          return {
            motifId: m.id,
            quarterTurns,
            edges: [
              m.edges[matrix[0][1]],
              m.edges[matrix[1][2]],
              m.edges[matrix[2][1]],
              m.edges[matrix[1][0]],
            ],
          };
        });
      });
      const placed: TruchetTile[] = [],
        tick = fcBudget();
      const search = (): boolean => {
        tick();
        if (placed.length === x.rows * x.columns) return true;
        const row = Math.floor(placed.length / x.columns),
          column = placed.length % x.columns;
        const candidates = variants.filter(
          (v) =>
            (!x.matchEdges ||
              ((!row ||
                placed[(row - 1) * x.columns + column].edges[2] ===
                  v.edges[0]) &&
                (!column ||
                  placed[placed.length - 1].edges[1] === v.edges[3]))) &&
            (!x.outsideLabel ||
              ((row !== 0 || v.edges[0] === x.outsideLabel) &&
                (column !== x.columns - 1 || v.edges[1] === x.outsideLabel) &&
                (row !== x.rows - 1 || v.edges[2] === x.outsideLabel) &&
                (column !== 0 || v.edges[3] === x.outsideLabel))),
        );
        for (const v of fcChoices(candidates, random)) {
          placed.push(v);
          if (search()) return true;
          placed.pop();
        }
        return false;
      };
      if (!search())
        simpleError(
          "motifs",
          "No mosaic satisfies the supplied edge constraints.",
          "infeasible_mosaic",
        );
      const grid = Array.from({ length: x.rows }, (_, r) =>
        placed.slice(r * x.columns, (r + 1) * x.columns),
      );
      let matchedNeighborPairs = 0;
      for (let r = 0; r < x.rows; r++)
        for (let c = 0; c < x.columns; c++) {
          if (r && grid[r - 1][c].edges[2] === grid[r][c].edges[0])
            matchedNeighborPairs++;
          if (c && grid[r][c - 1].edges[1] === grid[r][c].edges[3])
            matchedNeighborPairs++;
        }
      return { grid, matchedNeighborPairs };
    },
  );
export const truchetTileMosaicExample = {
  input: {
    rows: 1,
    columns: 2,
    motifs: [{ id: "arc", edges: ["a", "b", "a", "b"], quarterTurns: [0, 1] }],
    matchEdges: true,
    outsideLabel: "",
    seed: 42,
  },
  output: {
    grid: [
      [
        { motifId: "arc", quarterTurns: 1, edges: ["b", "a", "b", "a"] },
        { motifId: "arc", quarterTurns: 1, edges: ["b", "a", "b", "a"] },
      ],
    ],
    matchedNeighborPairs: 1,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  TruchetTileMosaicInput,
  TruchetTileMosaicOutput
>;
export const truchetTileMosaicTool = createModelDefinition<
  TruchetTileMosaicInput,
  TruchetTileMosaicOutput
>({
  id: "random/truchet-tile-mosaic",
  title: "Random Truchet Tile Mosaic Generator",
  description:
    "Generate supplied Truchet motif orientations with optional N/E/S/W label matching and outside constraints using bounded backtracking.",
  inputSchema,
  outputSchema,
  execute: calculateTruchetTileMosaic,
});
export const runTruchetTileMosaic = truchetTileMosaicTool.execute;
export default truchetTileMosaicTool;
