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
import { calculateFieldWhitespaceTrimmer } from "../../csv/field-whitespace-trimmer/tool.js";
import {
  arraySchema,
  objectSchema,
  countSchema,
  textSchema,
  booleanSchema,
  enumSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  rowsSchema,
  outputRowsSchema,
  rectangular,
  csvItem,
  csvText,
  decodedRows,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type CsvWhitespaceCleaningCorpusInput = {
  readonly rows: CsvRows;
  readonly mutationCount: number;
  readonly seed?: number;
};
type Mutation = {
  readonly row: number;
  readonly column: number;
  readonly kind: "space" | "tab" | "nbsp" | "zwsp";
  readonly original: string;
  readonly mutated: string;
  readonly trimRestores: boolean;
};
export type CsvWhitespaceCleaningCorpusOutput = {
  readonly damagedRows: CsvRows;
  readonly cleanedRows: CsvRows;
  readonly mutations: readonly Mutation[];
  readonly cleaningRule: "ECMAScript-trim-preserving-ZWSP";
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    rows: rowsSchema,
    mutationCount: countSchema(256, 1),
    seed: generatorSeedSchema,
  },
  ["rows", "mutationCount"],
);
export const outputSchema = objectSchema({
  damagedRows: outputRowsSchema,
  cleanedRows: outputRowsSchema,
  mutations: arraySchema(
    objectSchema({
      row: countSchema(31),
      column: countSchema(7),
      kind: enumSchema(["space", "tab", "nbsp", "zwsp"]),
      original: textSchema,
      mutated: { type: "string", maxLength: 66 },
      trimRestores: booleanSchema,
    }),
    256,
  ),
  cleaningRule: enumSchema(["ECMAScript-trim-preserving-ZWSP"]),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvWhitespaceCleaningCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvWhitespaceCleaningCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvWhitespaceCleaningCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const width = rectangular(input.rows);
    if (input.mutationCount > width * input.rows.length)
      return simpleError(
        "mutationCount",
        "Distinct mutations must fit the table.",
        "infeasible_mutation_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      damagedRows = input.rows.map((row) => [...row]);
    const mutations = generatorSampleIndices(
      width * input.rows.length,
      input.mutationCount,
      random,
    ).map((index): Mutation => {
      const row = Math.floor(index / width),
        column = index % width,
        kind = csvItem(["space", "tab", "nbsp", "zwsp"] as const, random),
        padding = { space: " ", tab: "\t", nbsp: "\u00a0", zwsp: "\u200b" }[
          kind
        ];
      const target = damagedRows[row];
      if (!target) throw new Error("Mutated row missing.");
      const original = target[column] ?? "",
        mutated = padding + original + padding;
      target[column] = mutated;
      return {
        row,
        column,
        kind,
        original,
        mutated,
        trimRestores: mutated.trim() === original,
      };
    });
    const cleanedRows = decodedRows(
      coreOutput(
        calculateFieldWhitespaceTrimmer({
          csv: csvText(damagedRows),
          delimiter: ",",
        }),
      ).csv,
    );
    return toolSuccess({
      damagedRows,
      cleanedRows,
      mutations,
      cleaningRule: "ECMAScript-trim-preserving-ZWSP",
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvWhitespaceCleaningCorpusExample = {
  input: {
    rows: [
      ["a", "b"],
      ["c", "d"],
    ],
    mutationCount: 1,
    seed: 42,
  },
  output: {
    damagedRows: [
      ["a", "b"],
      ["\tc\t", "d"],
    ],
    cleanedRows: [
      ["a", "b"],
      ["c", "d"],
    ],
    mutations: [
      {
        row: 1,
        column: 0,
        kind: "tab",
        original: "c",
        mutated: "\tc\t",
        trimRestores: true,
      },
    ],
    cleaningRule: "ECMAScript-trim-preserving-ZWSP",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvWhitespaceCleaningCorpusInput,
  CsvWhitespaceCleaningCorpusOutput
>;
export const csvWhitespaceCleaningCorpusTool = createModelDefinition<
  CsvWhitespaceCleaningCorpusInput,
  CsvWhitespaceCleaningCorpusOutput
>({
  id: "random/csv-whitespace-cleaning-corpus",
  title: "Random CSV Whitespace Cleaning Corpus Generator",
  description:
    "Plant distinct boundary space, tab, NBSP or zero-width-space mutations in supplied cells and retain actual ECMAScript trimming answers, including ZWSP controls that survive trimming.",
  inputSchema,
  outputSchema,
  execute: calculateCsvWhitespaceCleaningCorpus,
});
export const runCsvWhitespaceCleaningCorpus =
  csvWhitespaceCleaningCorpusTool.execute;
export default csvWhitespaceCleaningCorpusTool;
