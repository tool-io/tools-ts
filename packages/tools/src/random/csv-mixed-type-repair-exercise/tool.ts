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
import {
  calculateMixedTypeColumnDetectorSamples,
  mixedTypeColumnDetectorSamplesOutputSchema,
  type MixedTypeColumnDetectorSamplesOutput,
} from "../../csv/mixed-type-column-detector-samples/tool.js";
import { calculateBooleanTokenNormalizerYesNoTrueFalse10 } from "../../csv/boolean-token-normalizer-yes-no-true-false-1-0/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  integerSchema,
  booleanSchema,
  enumSchema,
  countSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  csvTextSchema,
  csvItem,
  csvText,
} from "../m500b-csv-algorithms-csv.js";

export type CsvMixedTypeRepairExerciseInput = {
  readonly columnType: "integer" | "boolean";
  readonly values: readonly string[];
  readonly seed?: number;
};
export type CsvMixedTypeRepairExerciseOutput = {
  readonly damagedValues: readonly string[];
  readonly answerValues: readonly string[];
  readonly originalIntegers: readonly number[];
  readonly originalBooleans: readonly boolean[];
  readonly changedRow: number;
  readonly policy: "restore-original";
  readonly audit: MixedTypeColumnDetectorSamplesOutput;
  readonly csv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    columnType: enumSchema(["integer", "boolean"]),
    values: arraySchema(textSchema, 32, 1),
    seed: generatorSeedSchema,
  },
  ["columnType", "values"],
);
export const outputSchema = objectSchema({
  damagedValues: arraySchema(textSchema, 32),
  answerValues: arraySchema(textSchema, 32),
  originalIntegers: arraySchema(integerSchema, 32),
  originalBooleans: arraySchema(booleanSchema, 32),
  changedRow: countSchema(31),
  policy: enumSchema(["restore-original"]),
  audit: mixedTypeColumnDetectorSamplesOutputSchema,
  csv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvMixedTypeRepairExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvMixedTypeRepairExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvMixedTypeRepairExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const originalIntegers: number[] = [],
      originalBooleans: boolean[] = [];
    for (const [index, cell] of input.values.entries()) {
      if (input.columnType === "integer") {
        if (
          !/^[+-]?(?:0|[1-9][0-9]*)(?![\s\S])/u.test(cell) ||
          !Number.isSafeInteger(Number(cell))
        )
          return simpleError(
            "values." + index,
            "Supply an exact safe integer spelling.",
            "invalid_integer",
          );
        originalIntegers.push(Number(cell) || 0);
      } else {
        const normalized = calculateBooleanTokenNormalizerYesNoTrueFalse10({
          values: [cell],
        });
        if (!normalized.ok)
          return simpleError(
            "values." + index,
            "Use a supported Boolean spelling.",
            "unknown_boolean",
          );
        originalBooleans.push(normalized.output.values[0] ?? false);
      }
    }
    const random = createGeneratorRandom(input.seed, context),
      changedRow = csvItem(
        input.values.map((_, index) => index),
        random,
      ),
      damagedValues = [...input.values];
    damagedValues[changedRow] = "?";
    const csv = csvText([["value"], ...damagedValues.map((value) => [value])]);
    const audit = coreOutput(
      calculateMixedTypeColumnDetectorSamples({
        csv,
        delimiter: ",",
        hasHeader: true,
      }),
    );
    return toolSuccess({
      damagedValues,
      answerValues: [...input.values],
      originalIntegers,
      originalBooleans,
      changedRow,
      policy: "restore-original",
      audit,
      csv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvMixedTypeRepairExerciseExample = {
  input: { columnType: "integer", values: ["2", "5"], seed: 42 },
  output: {
    damagedValues: ["2", "?"],
    answerValues: ["2", "5"],
    originalIntegers: [2, 5],
    originalBooleans: [],
    changedRow: 1,
    policy: "restore-original",
    audit: {
      columns: [{ column: 0, types: ["integer", "text"], mixed: true }],
    },
    csv: "value\n2\n?",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvMixedTypeRepairExerciseInput,
  CsvMixedTypeRepairExerciseOutput
>;
export const csvMixedTypeRepairExerciseTool = createModelDefinition<
  CsvMixedTypeRepairExerciseInput,
  CsvMixedTypeRepairExerciseOutput
>({
  id: "random/csv-mixed-type-repair-exercise",
  title: "Random CSV Mixed Type Repair Exercise Generator",
  description:
    "Plant an incompatible question-mark cell in a supplied integer or Boolean column, retaining original typed values and an explicit restore-original cleaning policy alongside the lexical type audit.",
  inputSchema,
  outputSchema,
  execute: calculateCsvMixedTypeRepairExercise,
});
export const runCsvMixedTypeRepairExercise =
  csvMixedTypeRepairExerciseTool.execute;
export default csvMixedTypeRepairExerciseTool;
