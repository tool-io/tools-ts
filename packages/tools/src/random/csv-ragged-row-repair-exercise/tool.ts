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
  generatorSampleIndices,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateRaggedRowsWrongFieldCountFinder } from "../../csv/ragged-rows-wrong-field-count-finder/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  enumSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  outputRowsSchema,
  csvTextSchema,
  rectangular,
  csvItem,
  csvText,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvRaggedRowRepairExerciseInput = {
  readonly rows: CsvRows;
  readonly mutationCount: number;
  readonly extraValue: string;
  readonly seed?: number;
};
type Change = {
  readonly row: number;
  readonly column: number;
  readonly kind: "remove" | "append";
  readonly value: string;
};
export type CsvRaggedRowRepairExerciseOutput = {
  readonly damagedRows: CsvRows;
  readonly answerRows: CsvRows;
  readonly changes: readonly Change[];
  readonly raggedIndices: readonly number[];
  readonly csv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    rows: arraySchema(arraySchema(textSchema, 8, 2), 32, 1),
    mutationCount: countSchema(32, 1),
    extraValue: textSchema,
    seed: generatorSeedSchema,
  },
  ["rows", "mutationCount", "extraValue"],
);
export const outputSchema = objectSchema({
  damagedRows: outputRowsSchema,
  answerRows: outputRowsSchema,
  changes: arraySchema(
    objectSchema({
      row: countSchema(31),
      column: countSchema(8),
      kind: enumSchema(["remove", "append"]),
      value: textSchema,
    }),
    32,
  ),
  raggedIndices: arraySchema(countSchema(31), 32),
  csv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvRaggedRowRepairExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvRaggedRowRepairExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvRaggedRowRepairExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const width = rectangular(input.rows);
    if (input.mutationCount > input.rows.length)
      return simpleError(
        "mutationCount",
        "Select no more mutations than rows.",
        "infeasible_mutation_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      damagedRows = input.rows.map((row) => [...row]);
    const changes = generatorSampleIndices(
      input.rows.length,
      input.mutationCount,
      random,
    ).map((row): Change => {
      const kind = csvItem(["remove", "append"] as const, random),
        column = kind === "remove" ? random.integer(0, width - 1) : width;
      const target = damagedRows[row];
      if (!target) throw new Error("Selected row disappeared.");
      const value =
        kind === "append" ? input.extraValue : (target[column] ?? "");
      if (kind === "append") target.push(value);
      else target.splice(column, 1);
      return { row, column, kind, value };
    });
    const csv = csvText(damagedRows),
      audit = coreOutput(
        calculateRaggedRowsWrongFieldCountFinder({
          csv,
          delimiter: ",",
          expectedColumns: width,
        }),
      );
    return toolSuccess({
      damagedRows,
      answerRows: input.rows.map((row) => [...row]),
      changes,
      raggedIndices: audit.recordIndices,
      csv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvRaggedRowRepairExerciseExample = {
  input: {
    rows: [
      ["a", "1"],
      ["b", "2"],
    ],
    mutationCount: 1,
    extraValue: "extra",
    seed: 42,
  },
  output: {
    damagedRows: [["a", "1"], ["b"]],
    answerRows: [
      ["a", "1"],
      ["b", "2"],
    ],
    changes: [{ row: 1, column: 1, kind: "remove", value: "2" }],
    raggedIndices: [1],
    csv: "a,1\nb",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvRaggedRowRepairExerciseInput,
  CsvRaggedRowRepairExerciseOutput
>;
export const csvRaggedRowRepairExerciseTool = createModelDefinition<
  CsvRaggedRowRepairExerciseInput,
  CsvRaggedRowRepairExerciseOutput
>({
  id: "random/csv-ragged-row-repair-exercise",
  title: "Random CSV Ragged Row Repair Exercise Generator",
  description:
    "Mutate distinct supplied records of at least two fields by removing or appending one field, retaining pristine repair answers, field provenance and the CSV core's record-width audit.",
  inputSchema,
  outputSchema,
  execute: calculateCsvRaggedRowRepairExercise,
});
export const runCsvRaggedRowRepairExercise =
  csvRaggedRowRepairExerciseTool.execute;
export default csvRaggedRowRepairExerciseTool;
