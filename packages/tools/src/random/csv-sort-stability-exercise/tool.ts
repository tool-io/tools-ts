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
import { calculateSortRowsColumnLexicographic } from "../../csv/sort-rows-column-lexicographic/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  csvTextSchema,
  csvItem,
  csvText,
  decodedRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvSortStabilityExerciseInput = {
  readonly keys: readonly string[];
  readonly rowCount: number;
  readonly seed?: number;
};
export type CsvSortStabilityExerciseOutput = {
  readonly rows: readonly { readonly key: string; readonly ordinal: number }[];
  readonly stableOrdinals: readonly number[];
  readonly unstableOrdinals: readonly number[];
  readonly stableCsv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    keys: arraySchema(textSchema, 16, 1),
    rowCount: countSchema(32, 2),
    seed: generatorSeedSchema,
  },
  ["keys", "rowCount"],
);
export const outputSchema = objectSchema({
  rows: arraySchema(
    objectSchema({ key: textSchema, ordinal: countSchema(31) }),
    32,
  ),
  stableOrdinals: arraySchema(countSchema(31), 32),
  unstableOrdinals: arraySchema(countSchema(31), 32),
  stableCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvSortStabilityExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvSortStabilityExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvSortStabilityExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.keys, "keys");
    if (input.rowCount <= input.keys.length)
      return simpleError(
        "rowCount",
        "Include every key and at least one repeated key.",
        "insufficient_ties",
      );
    const random = createGeneratorRandom(input.seed, context),
      keys = [...input.keys];
    while (keys.length < input.rowCount) keys.push(csvItem(input.keys, random));
    const rows = random.shuffle(keys).map((key, ordinal) => ({ key, ordinal }));
    const stableCsv = coreOutput(
      calculateSortRowsColumnLexicographic({
        csv: csvText([
          ["key", "ordinal"],
          ...rows.map((row) => [row.key, String(row.ordinal)]),
        ]),
        delimiter: ",",
        hasHeader: true,
        column: 0,
        direction: "ascending",
      }),
    ).csv;
    const stableOrdinals = decodedRows(stableCsv)
      .slice(1)
      .map((row) => Number(row[1]));
    const unstableOrdinals = [...rows]
      .sort((a, b) =>
        a.key < b.key ? -1 : a.key > b.key ? 1 : b.ordinal - a.ordinal,
      )
      .map((row) => row.ordinal);
    return toolSuccess({
      rows,
      stableOrdinals,
      unstableOrdinals,
      stableCsv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvSortStabilityExerciseExample = {
  input: { keys: ["b", "a"], rowCount: 3, seed: 42 },
  output: {
    rows: [
      { key: "b", ordinal: 0 },
      { key: "a", ordinal: 1 },
      { key: "a", ordinal: 2 },
    ],
    stableOrdinals: [1, 2, 0],
    unstableOrdinals: [2, 1, 0],
    stableCsv: "key,ordinal\na,1\na,2\nb,0",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvSortStabilityExerciseInput,
  CsvSortStabilityExerciseOutput
>;
export const csvSortStabilityExerciseTool = createModelDefinition<
  CsvSortStabilityExerciseInput,
  CsvSortStabilityExerciseOutput
>({
  id: "random/csv-sort-stability-exercise",
  title: "Random CSV Sort Stability Exercise Generator",
  description:
    "Construct shuffled tie-heavy key rows with original ordinals and compare the core's stable UTF-16 sort against a deliberately reversed-within-ties ordering.",
  inputSchema,
  outputSchema,
  execute: calculateCsvSortStabilityExercise,
});
export const runCsvSortStabilityExercise = csvSortStabilityExerciseTool.execute;
export default csvSortStabilityExerciseTool;
