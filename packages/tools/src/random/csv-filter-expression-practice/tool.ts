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
import { calculateFilterRowsColumnEqualsValue } from "../../csv/filter-rows-column-equals-value/tool.js";
import { calculateFilterRowsNumericGreaterThreshold } from "../../csv/filter-rows-numeric-greater-threshold/tool.js";
import {
  parseDecimal,
  compareDecimal,
} from "../../csv/currency-symbol-strip-to-number/tool.js";
import {
  arraySchema,
  objectSchema,
  textSchema,
  integerSchema,
  countSchema,
  booleanSchema,
  distinct,
  ordered,
  coreOutput,
} from "../m500b-csv-algorithms-schemas.js";
import {
  csvTextSchema,
  csvItem,
  csvText,
} from "../m500b-csv-algorithms-csv.js";

export type CsvFilterPredicate = {
  readonly kind: "equals" | "greater";
  readonly value: string;
};
export type CsvFilterExpressionPracticeInput = {
  readonly categories: readonly string[];
  readonly rowCount: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly predicates: readonly CsvFilterPredicate[];
  readonly seed?: number;
};
export type CsvFilterExpressionPracticeOutput = {
  readonly rows: readonly {
    readonly category: string;
    readonly amount: number;
  }[];
  readonly csv: string;
  readonly exercises: readonly {
    readonly predicate: CsvFilterPredicate;
    readonly passes: readonly boolean[];
    readonly selectedCsv: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const predicateSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    objectSchema({
      kind: { type: "string", const: "equals" },
      value: textSchema,
    }),
    objectSchema({
      kind: { type: "string", const: "greater" },
      value: textSchema,
    }),
  ],
} as const;
export const inputSchema = objectSchema(
  {
    categories: arraySchema(textSchema, 16, 1),
    rowCount: countSchema(32, 1),
    minimumValue: integerSchema,
    maximumValue: integerSchema,
    predicates: arraySchema(predicateSchema, 8, 1),
    seed: generatorSeedSchema,
  },
  ["categories", "rowCount", "minimumValue", "maximumValue", "predicates"],
);
export const outputSchema = objectSchema({
  rows: arraySchema(
    objectSchema({ category: textSchema, amount: integerSchema }),
    32,
  ),
  csv: csvTextSchema,
  exercises: arraySchema(
    objectSchema({
      predicate: predicateSchema,
      passes: arraySchema(booleanSchema, 32),
      selectedCsv: csvTextSchema,
    }),
    8,
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is CsvFilterExpressionPracticeInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvFilterExpressionPractice = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvFilterExpressionPracticeOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.categories, "categories");
    ordered(input.minimumValue, input.maximumValue);
    for (const [index, predicate] of input.predicates.entries())
      if (predicate.kind === "greater" && !parseDecimal(predicate.value))
        return simpleError(
          "predicates." + index + ".value",
          "Supply a dot-decimal threshold without grouping.",
          "invalid_decimal",
        );
    const random = createGeneratorRandom(input.seed, context),
      rows = Array.from({ length: input.rowCount }, () => ({
        category: csvItem(input.categories, random),
        amount: random.integer(input.minimumValue, input.maximumValue),
      }));
    const csv = csvText([
      ["category", "amount"],
      ...rows.map((row) => [row.category, String(row.amount)]),
    ]);
    const exercises = input.predicates.map((predicate) => {
      const selectedCsv = coreOutput(
        predicate.kind === "equals"
          ? calculateFilterRowsColumnEqualsValue({
              csv,
              delimiter: ",",
              hasHeader: true,
              column: 0,
              value: predicate.value,
            })
          : calculateFilterRowsNumericGreaterThreshold({
              csv,
              delimiter: ",",
              hasHeader: true,
              column: 1,
              threshold: predicate.value,
            }),
      ).csv;
      const threshold =
        predicate.kind === "greater"
          ? parseDecimal(predicate.value)
          : undefined;
      const passes = rows.map((row) => {
        if (predicate.kind === "equals")
          return row.category === predicate.value;
        const amount = parseDecimal(String(row.amount));
        if (!amount || !threshold)
          throw new Error("Validated threshold or integer decimal vanished.");
        return compareDecimal(amount, threshold) > 0;
      });
      return { predicate: { ...predicate }, passes, selectedCsv };
    });
    return toolSuccess({
      rows,
      csv,
      exercises,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvFilterExpressionPracticeExample = {
  input: {
    categories: ["red", "blue"],
    rowCount: 2,
    minimumValue: 0,
    maximumValue: 9,
    predicates: [
      { kind: "equals", value: "blue" },
      { kind: "greater", value: "5" },
    ],
    seed: 42,
  },
  output: {
    rows: [
      { category: "blue", amount: 4 },
      { category: "blue", amount: 6 },
    ],
    csv: "category,amount\nblue,4\nblue,6",
    exercises: [
      {
        predicate: { kind: "equals", value: "blue" },
        passes: [true, true],
        selectedCsv: "category,amount\nblue,4\nblue,6",
      },
      {
        predicate: { kind: "greater", value: "5" },
        passes: [false, true],
        selectedCsv: "category,amount\nblue,6",
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CsvFilterExpressionPracticeInput,
  CsvFilterExpressionPracticeOutput
>;
export const csvFilterExpressionPracticeTool = createModelDefinition<
  CsvFilterExpressionPracticeInput,
  CsvFilterExpressionPracticeOutput
>({
  id: "random/csv-filter-expression-practice",
  title: "Random CSV Filter Expression Practice Generator",
  description:
    "Generate synthetic category and integer rows for supplied equality or exact-decimal greater-than predicates, retaining per-row pass labels and delegated CSV filter answers without evaluating expressions.",
  inputSchema,
  outputSchema,
  execute: calculateCsvFilterExpressionPractice,
});
export const runCsvFilterExpressionPractice =
  csvFilterExpressionPracticeTool.execute;
export default csvFilterExpressionPracticeTool;
