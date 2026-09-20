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
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateBooleanTokenNormalizerYesNoTrueFalse10 } from "../../csv/boolean-token-normalizer-yes-no-true-false-1-0/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  booleanSchema,
  nullableSchema,
  enumSchema,
} from "../m500b-csv-algorithms-schemas.js";
import { csvItem } from "../m500b-csv-algorithms-csv.js";

export type CsvBooleanTokenCleaningExerciseInput = {
  readonly tokens: readonly string[];
  readonly count: number;
  readonly seed?: number;
};
export type CsvBooleanTokenCleaningExerciseOutput = {
  readonly cells: readonly {
    readonly token: string;
    readonly classification: "boolean" | "empty" | "unknown";
    readonly normalized: boolean | null;
  }[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    tokens: arraySchema(textSchema, 32, 1),
    count: countSchema(32, 1),
    seed: generatorSeedSchema,
  },
  ["tokens", "count"],
);
export const outputSchema = objectSchema({
  cells: arraySchema(
    objectSchema({
      token: textSchema,
      classification: enumSchema(["boolean", "empty", "unknown"]),
      normalized: nullableSchema(booleanSchema),
    }),
    32,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CsvBooleanTokenCleaningExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvBooleanTokenCleaningExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvBooleanTokenCleaningExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    const cells = Array.from(
      { length: input.count },
      (): CsvBooleanTokenCleaningExerciseOutput["cells"][number] => {
        const token = csvItem(input.tokens, random),
          result = calculateBooleanTokenNormalizerYesNoTrueFalse10({
            values: [token],
          });
        if (result.ok)
          return {
            token,
            classification: "boolean",
            normalized: result.output.values[0] ?? false,
          };
        if (
          result.error.issues.some((issue) => issue.code !== "unknown_boolean")
        )
          throw new Error(
            "Constructed Boolean token had an unexpected core failure.",
          );
        return {
          token,
          classification: token.trim() === "" ? "empty" : "unknown",
          normalized: null,
        };
      },
    );
    return toolSuccess({
      cells,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvBooleanTokenCleaningExerciseExample = {
  input: { tokens: ["YES", "", "maybe", "0"], count: 3, seed: 42 },
  output: {
    cells: [
      { token: "maybe", classification: "unknown", normalized: null },
      { token: "", classification: "empty", normalized: null },
      { token: "0", classification: "boolean", normalized: false },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvBooleanTokenCleaningExerciseInput,
  CsvBooleanTokenCleaningExerciseOutput
>;
export const csvBooleanTokenCleaningExerciseTool = createModelDefinition<
  CsvBooleanTokenCleaningExerciseInput,
  CsvBooleanTokenCleaningExerciseOutput
>({
  id: "random/csv-boolean-token-cleaning-exercise",
  title: "Random CSV Boolean Token Cleaning Exercise Generator",
  description:
    "Sample caller-selected Boolean spellings, blank cells and unknown controls, retaining explicit classifications and nullable normalization answers from the Boolean token core.",
  inputSchema,
  outputSchema,
  execute: calculateCsvBooleanTokenCleaningExercise,
});
export const runCsvBooleanTokenCleaningExercise =
  csvBooleanTokenCleaningExerciseTool.execute;
export default csvBooleanTokenCleaningExerciseTool;
