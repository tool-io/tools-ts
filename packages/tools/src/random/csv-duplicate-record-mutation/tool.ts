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
import { calculateDuplicateRowsExtractor } from "../../csv/duplicate-rows-extractor/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  textSchema,
  enumSchema,
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

export type CsvDuplicateRecordMutationInput = {
  readonly rows: CsvRows;
  readonly exactCopies: number;
  readonly nearCopies: number;
  readonly nearColumn: number;
  readonly replacement: string;
  readonly seed?: number;
};
export type CsvDuplicateRecordMutationOutput = {
  readonly rows: CsvRows;
  readonly provenance: readonly {
    readonly sourceRow: number;
    readonly kind: "original" | "exact" | "near";
  }[];
  readonly duplicateGroups: readonly (readonly number[])[];
  readonly duplicateRowCount: number;
  readonly csv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    rows: rowsSchema,
    exactCopies: countSchema(16),
    nearCopies: countSchema(16),
    nearColumn: countSchema(7),
    replacement: textSchema,
    seed: generatorSeedSchema,
  },
  ["rows", "exactCopies", "nearCopies", "nearColumn", "replacement"],
);
export const outputSchema = objectSchema({
  rows: outputRowsSchema,
  provenance: arraySchema(
    objectSchema({
      sourceRow: countSchema(31),
      kind: enumSchema(["original", "exact", "near"]),
    }),
    64,
  ),
  duplicateGroups: arraySchema(arraySchema(countSchema(63), 64), 32),
  duplicateRowCount: countSchema(64),
  csv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvDuplicateRecordMutationInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvDuplicateRecordMutation = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvDuplicateRecordMutationOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const width = rectangular(input.rows);
    if (input.nearColumn >= width)
      return simpleError(
        "nearColumn",
        "Column lies outside the original table.",
        "column_range",
      );
    if (input.exactCopies + input.nearCopies === 0)
      return simpleError(
        "exactCopies",
        "Request at least one appended mutation.",
        "empty_mutation",
      );
    if (
      input.nearCopies > 0 &&
      input.rows.some((row) => row[input.nearColumn] === input.replacement)
    )
      return simpleError(
        "replacement",
        "The near replacement must differ from every selectable original cell.",
        "unchanged_mutation",
      );
    const random = createGeneratorRandom(input.seed, context),
      rows = input.rows.map((row) => [...row]);
    const provenance: {
      sourceRow: number;
      kind: "original" | "exact" | "near";
    }[] = input.rows.map((_, sourceRow) => ({ sourceRow, kind: "original" }));
    for (
      let index = 0;
      index < input.exactCopies + input.nearCopies;
      index += 1
    ) {
      const sourceRow = csvItem(
          input.rows.map((_, row) => row),
          random,
        ),
        original = input.rows[sourceRow];
      if (!original) throw new Error("Source row disappeared.");
      const row = [...original],
        kind = index < input.exactCopies ? "exact" : "near";
      if (kind === "near") row[input.nearColumn] = input.replacement;
      rows.push(row);
      provenance.push({ sourceRow, kind });
    }
    const groups = new Map<string, number[]>();
    rows.forEach((row, index) => {
      const key = JSON.stringify(row),
        indices = groups.get(key) ?? [];
      indices.push(index);
      groups.set(key, indices);
    });
    const csv = csvText(rows),
      duplicateRowCount = coreOutput(
        calculateDuplicateRowsExtractor({
          csv,
          delimiter: ",",
          hasHeader: false,
        }),
      ).duplicateRowCount;
    return toolSuccess({
      rows,
      provenance,
      duplicateGroups: [...groups.values()].filter((group) => group.length > 1),
      duplicateRowCount,
      csv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvDuplicateRecordMutationExample = {
  input: {
    rows: [
      ["a", "1"],
      ["b", "2"],
    ],
    exactCopies: 1,
    nearCopies: 1,
    nearColumn: 1,
    replacement: "9",
    seed: 42,
  },
  output: {
    rows: [
      ["a", "1"],
      ["b", "2"],
      ["b", "2"],
      ["a", "9"],
    ],
    provenance: [
      { sourceRow: 0, kind: "original" },
      { sourceRow: 1, kind: "original" },
      { sourceRow: 1, kind: "exact" },
      { sourceRow: 0, kind: "near" },
    ],
    duplicateGroups: [[1, 2]],
    duplicateRowCount: 2,
    csv: "a,1\nb,2\nb,2\na,9",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvDuplicateRecordMutationInput,
  CsvDuplicateRecordMutationOutput
>;
export const csvDuplicateRecordMutationTool = createModelDefinition<
  CsvDuplicateRecordMutationInput,
  CsvDuplicateRecordMutationOutput
>({
  id: "random/csv-duplicate-record-mutation",
  title: "Random CSV Duplicate Record Mutation Dataset Generator",
  description:
    "Append sampled exact and caller-defined one-cell near duplicates to supplied records, retaining source provenance and actual exact-duplicate groups including preexisting duplicates.",
  inputSchema,
  outputSchema,
  execute: calculateCsvDuplicateRecordMutation,
});
export const runCsvDuplicateRecordMutation =
  csvDuplicateRecordMutationTool.execute;
export default csvDuplicateRecordMutationTool;
