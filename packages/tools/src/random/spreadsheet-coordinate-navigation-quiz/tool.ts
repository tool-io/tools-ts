import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
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
import { columnLetters } from "../../csv/column-letter-to-index-a1/tool.js";
import {
  calculateCellCoordinateParserA1,
  cellCoordinateParserA1OutputSchema,
  type CellCoordinateParserA1Output,
} from "../../csv/cell-coordinate-parser-a1/tool.js";
import { calculateA1RangeCellCountExpander } from "../../csv/a1-range-cell-count-expander/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  booleanSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";

export type SpreadsheetCoordinateNavigationQuizInput = {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly height: number;
  readonly width: number;
  readonly count: number;
  readonly absolute: boolean;
  readonly seed?: number;
};
export type SpreadsheetCoordinateNavigationQuizOutput = {
  readonly prompts: readonly {
    readonly address: string;
    readonly coordinate: CellCoordinateParserA1Output;
    readonly range: string;
    readonly cellCount: number;
    readonly addresses: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    rowCount: countSchema(128, 1),
    columnCount: countSchema(128, 1),
    height: countSchema(8, 1),
    width: countSchema(8, 1),
    count: countSchema(16, 1),
    absolute: booleanSchema,
    seed: generatorSeedSchema,
  },
  ["rowCount", "columnCount", "height", "width", "count", "absolute"],
);
export const outputSchema = objectSchema({
  prompts: arraySchema(
    objectSchema({
      address: textSchema,
      coordinate: cellCoordinateParserA1OutputSchema,
      range: textSchema,
      cellCount: countSchema(64, 1),
      addresses: arraySchema(textSchema, 64, 1),
    }),
    16,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is SpreadsheetCoordinateNavigationQuizInput =>
  matchesModelInput(input, inputSchema);
export const calculateSpreadsheetCoordinateNavigationQuiz = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SpreadsheetCoordinateNavigationQuizOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.height > input.rowCount || input.width > input.columnCount)
      return simpleError(
        "height",
        "The rectangle must fit the declared row and column universe.",
        "infeasible_rectangle",
      );
    const random = createGeneratorRandom(input.seed, context),
      prompts = Array.from({ length: input.count }, () => {
        const row = random.integer(1, input.rowCount - input.height + 1),
          column = random.integer(1, input.columnCount - input.width + 1),
          marker = input.absolute ? "$" : "";
        const address = marker + columnLetters(column) + marker + row;
        const range =
          columnLetters(column) +
          row +
          ":" +
          columnLetters(column + input.width - 1) +
          (row + input.height - 1);
        return {
          address,
          coordinate: coreOutput(calculateCellCoordinateParserA1({ address })),
          range,
          ...coreOutput(calculateA1RangeCellCountExpander({ range })),
        };
      });
    return toolSuccess({
      prompts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const spreadsheetCoordinateNavigationQuizExample = {
  input: {
    rowCount: 10,
    columnCount: 28,
    height: 2,
    width: 2,
    count: 1,
    absolute: true,
    seed: 42,
  },
  output: {
    prompts: [
      {
        address: "$M$6",
        coordinate: {
          row: 6,
          column: 13,
          absoluteRow: true,
          absoluteColumn: true,
          canonical: "$M$6",
        },
        range: "M6:N7",
        cellCount: 4,
        addresses: ["M6", "N6", "M7", "N7"],
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SpreadsheetCoordinateNavigationQuizInput,
  SpreadsheetCoordinateNavigationQuizOutput
>;
export const spreadsheetCoordinateNavigationQuizTool = createModelDefinition<
  SpreadsheetCoordinateNavigationQuizInput,
  SpreadsheetCoordinateNavigationQuizOutput
>({
  id: "random/spreadsheet-coordinate-navigation-quiz",
  title: "Random Spreadsheet Coordinate Navigation Quiz Generator",
  description:
    "Generate bounded A1 coordinate and rectangular-range prompts with explicit absolute markers, then delegate one-based coordinate and row-major expansion answers.",
  inputSchema,
  outputSchema,
  execute: calculateSpreadsheetCoordinateNavigationQuiz,
});
export const runSpreadsheetCoordinateNavigationQuiz =
  spreadsheetCoordinateNavigationQuizTool.execute;
export default spreadsheetCoordinateNavigationQuizTool;
