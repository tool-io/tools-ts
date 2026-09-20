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
import {
  object,
  array,
  integer,
  number,
  label,
  bool,
  core,
  finite,
  safe,
  distinct,
  sum,
  finish,
} from "../m500b-charts-math-graphs-support.js";
import { calculatePascalRow } from "../../math/pascal-row/tool.js";

export type PascalTriangleMissingEntryInput = {
  readonly minimumRow: number;
  readonly maximumRow: number;
  readonly seed?: number;
};
export type PascalTriangleMissingEntryOutput = {
  readonly row: number;
  readonly column: number;
  readonly prompt: readonly (string | null)[];
  readonly answer: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = object(
  {
    minimumRow: { type: "integer", minimum: 0, maximum: 64 },
    maximumRow: { type: "integer", minimum: 0, maximum: 64 },
    seed: generatorSeedSchema,
  },
  ["minimumRow", "maximumRow"],
);
export const outputSchema = object({
  row: integer,
  column: integer,
  prompt: array({ anyOf: [{ type: "string" }, { type: "null" }] }, 65, 1),
  answer: { type: "string", minLength: 1 },
  randomness: generatorReplaySchema,
});
const isInput = (value: unknown): value is PascalTriangleMissingEntryInput =>
  matchesModelInput(value, inputSchema);
export const calculatePascalTriangleMissingEntry = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PascalTriangleMissingEntryOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    if (input.minimumRow > input.maximumRow)
      simpleError("maximumRow", "Row range must be ordered.", "invalid_range");
    const row = random.integer(input.minimumRow, input.maximumRow),
      coefficients = core(calculatePascalRow({ n: row })).coefficients,
      column = random.integer(0, row),
      answer = coefficients[column];
    if (answer === undefined)
      throw new Error("Pascal core row length mismatch");
    const result = {
      row,
      column,
      prompt: coefficients.map((c, i) => (i === column ? null : c)),
      answer,
    };
    return toolSuccess(
      finish({ ...result, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const pascalTriangleMissingEntryExample = {
  input: { minimumRow: 3, maximumRow: 5, seed: 42 },
  output: {
    row: 4,
    column: 2,
    prompt: ["1", "4", null, "4", "1"],
    answer: "6",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PascalTriangleMissingEntryInput,
  PascalTriangleMissingEntryOutput
>;
export const pascalTriangleMissingEntryTool = createModelDefinition<
  PascalTriangleMissingEntryInput,
  PascalTriangleMissingEntryOutput
>({
  id: "random/pascal-triangle-missing-entry",
  title: "Random Pascal Triangle Missing Entry Generator",
  description:
    "Draw a bounded Pascal row and hide one exact string coefficient while retaining its row/column answer key.",
  inputSchema,
  outputSchema,
  execute: calculatePascalTriangleMissingEntry,
});
export const runPascalTriangleMissingEntry =
  pascalTriangleMissingEntryTool.execute;
export default pascalTriangleMissingEntryTool;
