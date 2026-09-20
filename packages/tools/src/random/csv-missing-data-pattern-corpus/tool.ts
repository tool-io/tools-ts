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
import { calculateFillMissingCellsDefaultValue } from "../../csv/fill-missing-cells-default-value/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  booleanSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  rowsSchema,
  outputRowsSchema,
  csvTextSchema,
  rectangular,
  csvText,
  type CsvRows,
} from "../m500b-csv-algorithms-csv.js";

export type MissingPattern =
  | { readonly kind: "cell" | "column"; readonly count: number }
  | { readonly kind: "block"; readonly height: number; readonly width: number };
export type CsvMissingDataPatternCorpusInput = {
  readonly rows: CsvRows;
  readonly pattern: MissingPattern;
  readonly defaultValue: string;
  readonly seed?: number;
};
export type CsvMissingDataPatternCorpusOutput = {
  readonly originalRows: CsvRows;
  readonly damagedRows: CsvRows;
  readonly missingMask: readonly (readonly boolean[])[];
  readonly defaultFilledCsv: string;
  readonly randomness: GeneratorReplay;
};
const patternSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    objectSchema({
      kind: { type: "string", const: "cell" },
      count: countSchema(256, 1),
    }),
    objectSchema({
      kind: { type: "string", const: "column" },
      count: countSchema(8, 1),
    }),
    objectSchema({
      kind: { type: "string", const: "block" },
      height: countSchema(32, 1),
      width: countSchema(8, 1),
    }),
  ],
} as const;
export const inputSchema = objectSchema(
  {
    rows: rowsSchema,
    pattern: patternSchema,
    defaultValue: textSchema,
    seed: generatorSeedSchema,
  },
  ["rows", "pattern", "defaultValue"],
);
export const outputSchema = objectSchema({
  originalRows: outputRowsSchema,
  damagedRows: outputRowsSchema,
  missingMask: arraySchema(arraySchema(booleanSchema, 8), 32),
  defaultFilledCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvMissingDataPatternCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvMissingDataPatternCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvMissingDataPatternCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const width = rectangular(input.rows),
      height = input.rows.length,
      pattern = input.pattern;
    if (
      pattern.kind === "block"
        ? pattern.height > height || pattern.width > width
        : pattern.count > (pattern.kind === "cell" ? height * width : width)
    )
      return simpleError(
        "pattern",
        "The requested mask must fit the supplied table.",
        "infeasible_pattern",
      );
    const random = createGeneratorRandom(input.seed, context),
      missingMask = input.rows.map((row) => row.map(() => false));
    const mark = (row: number, column: number): void => {
      const maskRow = missingMask[row];
      if (!maskRow) throw new Error("Mask row missing.");
      maskRow[column] = true;
    };
    if (pattern.kind === "block") {
      const rowStart = random.integer(0, height - pattern.height),
        columnStart = random.integer(0, width - pattern.width);
      for (let row = rowStart; row < rowStart + pattern.height; row += 1)
        for (
          let column = columnStart;
          column < columnStart + pattern.width;
          column += 1
        )
          mark(row, column);
    } else
      for (const index of generatorSampleIndices(
        pattern.kind === "cell" ? height * width : width,
        pattern.count,
        random,
      )) {
        if (pattern.kind === "cell")
          mark(Math.floor(index / width), index % width);
        else for (let row = 0; row < height; row += 1) mark(row, index);
      }
    const damagedRows = input.rows.map((row, index) =>
      row.map((cell, column) => (missingMask[index]?.[column] ? "" : cell)),
    );
    const filledRows = input.rows.map((row, index) =>
      row.map((cell, column) =>
        missingMask[index]?.[column] ? input.defaultValue : cell,
      ),
    );
    const defaultFilledCsv = coreOutput(
      calculateFillMissingCellsDefaultValue({
        csv: csvText(filledRows),
        delimiter: ",",
        width,
        defaultValue: input.defaultValue,
      }),
    ).csv;
    return toolSuccess({
      originalRows: input.rows.map((row) => [...row]),
      damagedRows,
      missingMask,
      defaultFilledCsv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvMissingDataPatternCorpusExample = {
  input: {
    rows: [
      ["a", "b"],
      ["c", "d"],
    ],
    pattern: { kind: "block", height: 1, width: 1 },
    defaultValue: "NA",
    seed: 42,
  },
  output: {
    originalRows: [
      ["a", "b"],
      ["c", "d"],
    ],
    damagedRows: [
      ["a", "b"],
      ["", "d"],
    ],
    missingMask: [
      [false, false],
      [true, false],
    ],
    defaultFilledCsv: "a,b\nNA,d",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvMissingDataPatternCorpusInput,
  CsvMissingDataPatternCorpusOutput
>;
export const csvMissingDataPatternCorpusTool = createModelDefinition<
  CsvMissingDataPatternCorpusInput,
  CsvMissingDataPatternCorpusOutput
>({
  id: "random/csv-missing-data-pattern-corpus",
  title: "Random CSV Missing Data Pattern Corpus Generator",
  description:
    "Apply an exact cell, column or rectangular missingness mask to supplied data and retain pristine answers and explicit masked-cell filling; no statistical missingness mechanism is inferred.",
  inputSchema,
  outputSchema,
  execute: calculateCsvMissingDataPatternCorpus,
});
export const runCsvMissingDataPatternCorpus =
  csvMissingDataPatternCorpusTool.execute;
export default csvMissingDataPatternCorpusTool;
