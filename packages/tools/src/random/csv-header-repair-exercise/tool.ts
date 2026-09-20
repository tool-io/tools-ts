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
import { calculateDuplicateHeaderDetector } from "../../csv/duplicate-header-detector/tool.js";
import { calculateHeaderDedupeSuffixCounter } from "../../csv/header-dedupe-suffix-counter/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  distinct,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  rowsSchema,
  outputRowsSchema,
  csvTextSchema,
  rectangular,
  csvItem,
  csvText,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvHeaderRepairExerciseInput = {
  readonly headers: readonly string[];
  readonly rows: CsvRows;
  readonly seed?: number;
};
export type CsvHeaderRepairExerciseOutput = {
  readonly damagedHeaders: readonly string[];
  readonly repairedHeaders: readonly string[];
  readonly rows: CsvRows;
  readonly duplicateIndices: readonly (readonly number[])[];
  readonly csv: string;
  readonly repairedCsv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    headers: arraySchema({ ...textSchema, minLength: 1 }, 8, 1),
    rows: rowsSchema,
    seed: generatorSeedSchema,
  },
  ["headers", "rows"],
);
// A 64-unit header may uppercase to 3x its length, then lowercase to 2x
// that result. Ten columns need fewer than 16 further units for a reserved
// numeric suffix or the column_N fallback: 64 * 3 * 2 + 16 = 400.
export const outputSchema = objectSchema({
  damagedHeaders: arraySchema({ type: "string", maxLength: 192 }, 10),
  repairedHeaders: arraySchema({ type: "string", maxLength: 400 }, 10),
  rows: outputRowsSchema,
  duplicateIndices: arraySchema(
    arraySchema({ type: "integer", minimum: 0 }, 10),
    10,
  ),
  csv: csvTextSchema,
  repairedCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvHeaderRepairExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvHeaderRepairExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvHeaderRepairExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    rectangular(input.rows, input.headers.length);
    const normalized = input.headers.map((header) =>
      header.trim().toLowerCase(),
    );
    distinct(normalized, "headers");
    if (normalized.some((header) => header === ""))
      return simpleError(
        "headers",
        "Original headers must remain nonempty after trimming.",
        "empty_header",
      );
    const random = createGeneratorRandom(input.seed, context);
    const column = csvItem(
      input.headers.map((_, index) => index),
      random,
    );
    const damagedHeaders = input.headers.map((header, index) =>
      index === column ? header.toUpperCase() : header,
    );
    const selectedHeader = damagedHeaders[column];
    if (selectedHeader === undefined)
      throw new Error("Selected header disappeared.");
    damagedHeaders.push(selectedHeader, "");
    const rows = input.rows.map((row) => [...row, row[column] ?? "", ""]);
    const duplicateIndices = coreOutput(
      calculateDuplicateHeaderDetector({ headers: damagedHeaders }),
    ).duplicates.map((group) => group.indices);
    const repairedHeaders = coreOutput(
      calculateHeaderDedupeSuffixCounter({
        headers: damagedHeaders.map(
          (header, index) =>
            header.trim().toLowerCase() || "column_" + (index + 1),
        ),
      }),
    ).headers;
    return toolSuccess({
      damagedHeaders,
      repairedHeaders,
      rows,
      duplicateIndices,
      csv: csvText([damagedHeaders, ...rows]),
      repairedCsv: csvText([repairedHeaders, ...rows]),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvHeaderRepairExerciseExample = {
  input: { headers: ["id", "name"], rows: [["01", "Ada"]], seed: 42 },
  output: {
    damagedHeaders: ["id", "NAME", "NAME", ""],
    repairedHeaders: ["id", "name", "name_2", "column_4"],
    rows: [["01", "Ada", "Ada", ""]],
    duplicateIndices: [[1, 2]],
    csv: "id,NAME,NAME,\n01,Ada,Ada,",
    repairedCsv: "id,name,name_2,column_4\n01,Ada,Ada,",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvHeaderRepairExerciseInput,
  CsvHeaderRepairExerciseOutput
>;
export const csvHeaderRepairExerciseTool = createModelDefinition<
  CsvHeaderRepairExerciseInput,
  CsvHeaderRepairExerciseOutput
>({
  id: "random/csv-header-repair-exercise",
  title: "Random CSV Header Repair Exercise Generator",
  description:
    "Plant an uppercase duplicate column and an empty header in a supplied table, then retain exact duplicate positions and lowercase, blank-name and reserved-suffix repair answers.",
  inputSchema,
  outputSchema,
  execute: calculateCsvHeaderRepairExercise,
});
export const runCsvHeaderRepairExercise = csvHeaderRepairExerciseTool.execute;
export default csvHeaderRepairExerciseTool;
