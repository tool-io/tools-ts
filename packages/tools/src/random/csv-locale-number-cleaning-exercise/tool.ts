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
  parseDecimal,
  decimalText,
} from "../../csv/currency-symbol-strip-to-number/tool.js";
import { calculateSortRowsColumnNumericEuDecimalAware } from "../../csv/sort-rows-column-numeric-eu-decimal-aware/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  countSchema,
  enumSchema,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  csvTextSchema,
  csvItem,
  csvText,
} from "../m500b-csv-algorithms-csv.js";

export type CsvLocaleNumberCleaningExerciseInput = {
  readonly values: readonly string[];
  readonly count: number;
  readonly convention: "comma-decimal-dot-grouping";
  readonly seed?: number;
};
export type CsvLocaleNumberCleaningExerciseOutput = {
  readonly cells: readonly string[];
  readonly normalized: readonly string[];
  readonly sortedCsv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = objectSchema(
  {
    values: arraySchema({ ...textSchema, minLength: 1 }, 32, 1),
    count: countSchema(32, 1),
    convention: enumSchema(["comma-decimal-dot-grouping"]),
    seed: generatorSeedSchema,
  },
  ["values", "count", "convention"],
);
export const outputSchema = objectSchema({
  cells: arraySchema(textSchema, 32),
  normalized: arraySchema({ type: "string", maxLength: 64 }, 32),
  sortedCsv: csvTextSchema,
  randomness: generatorReplaySchema,
});
const isInput = (
  input: unknown,
): input is CsvLocaleNumberCleaningExerciseInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvLocaleNumberCleaningExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvLocaleNumberCleaningExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const [index, value] of input.values.entries())
      if (!parseDecimal(value, ",", "."))
        return simpleError(
          "values." + index,
          "Use comma decimals and optional valid dot grouping.",
          "invalid_decimal",
        );
    const random = createGeneratorRandom(input.seed, context),
      cells = Array.from({ length: input.count }, () =>
        csvItem(input.values, random),
      );
    const normalized = cells.map((cell) => {
      const value = parseDecimal(cell, ",", ".");
      if (!value) throw new Error("Validated decimal disappeared.");
      return decimalText(value);
    });
    const sortedCsv = coreOutput(
      calculateSortRowsColumnNumericEuDecimalAware({
        csv: csvText(
          cells.map((cell) => [cell]),
          ";",
        ),
        delimiter: ";",
        hasHeader: false,
        column: 0,
        direction: "ascending",
      }),
    ).csv;
    return toolSuccess({
      cells,
      normalized,
      sortedCsv,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvLocaleNumberCleaningExerciseExample = {
  input: {
    values: ["1.234,50", "-2,00", "0,10"],
    count: 3,
    convention: "comma-decimal-dot-grouping",
    seed: 42,
  },
  output: {
    cells: ["-2,00", "-2,00", "0,10"],
    normalized: ["-2", "-2", "0.1"],
    sortedCsv: "-2,00\n-2,00\n0,10",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvLocaleNumberCleaningExerciseInput,
  CsvLocaleNumberCleaningExerciseOutput
>;
export const csvLocaleNumberCleaningExerciseTool = createModelDefinition<
  CsvLocaleNumberCleaningExerciseInput,
  CsvLocaleNumberCleaningExerciseOutput
>({
  id: "random/csv-locale-number-cleaning-exercise",
  title: "Random CSV Locale Number Cleaning Exercise Generator",
  description:
    "Sample supplied decimal-comma cells under an explicit dot-grouping convention, retaining exact normalized decimal strings and the core's stable numeric sorting answer.",
  inputSchema,
  outputSchema,
  execute: calculateCsvLocaleNumberCleaningExercise,
});
export const runCsvLocaleNumberCleaningExercise =
  csvLocaleNumberCleaningExerciseTool.execute;
export default csvLocaleNumberCleaningExerciseTool;
