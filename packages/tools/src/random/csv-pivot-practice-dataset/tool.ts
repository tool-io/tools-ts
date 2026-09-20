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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  calculatePivot,
  type PivotAggregation,
  type PivotOutput,
} from "../../csv/pivot/tool.js";
import { calculateJsonToCsv } from "../../convert/json-to-csv/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type CsvPivotPracticeDatasetInput = {
  readonly categories: readonly (readonly string[])[];
  readonly distinctGroupCount: number;
  readonly rowCount: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly missingProbability: number;
  readonly aggregation: PivotAggregation;
  readonly delimiter: "," | ";" | "\t" | "|";
  readonly seed?: number;
};
export type CsvPivotPracticeDatasetOutput = {
  readonly groupColumns: readonly string[];
  readonly selectedGroups: readonly (readonly string[])[];
  readonly rows: readonly {
    readonly group: readonly string[];
    readonly value: number | null;
  }[];
  readonly csv: string;
  readonly aggregation: PivotAggregation;
  readonly table: PivotOutput["table"];
  readonly missingValueCount: number;
  readonly randomness: GeneratorReplay;
};
const groupSchema = {
  type: "array",
  minItems: 1,
  maxItems: 3,
  items: { type: "string", maxLength: 64 },
} as const;
const aggregationSchema = {
  type: "string",
  enum: ["count", "sum", "mean", "min", "max"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    categories: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 16,
        items: { type: "string", maxLength: 64 },
      },
    },
    distinctGroupCount: { type: "integer", minimum: 1, maximum: 32 },
    rowCount: { type: "integer", minimum: 1, maximum: 256 },
    minimumValue: { type: "integer" },
    maximumValue: { type: "integer" },
    missingProbability: { type: "number", minimum: 0, maximum: 1 },
    aggregation: aggregationSchema,
    delimiter: { type: "string", enum: [",", ";", "\t", "|"] },
    seed: generatorSeedSchema,
  },
  required: [
    "categories",
    "distinctGroupCount",
    "rowCount",
    "minimumValue",
    "maximumValue",
    "missingProbability",
    "aggregation",
    "delimiter",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupColumns: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", minLength: 2, maxLength: 2 },
    },
    selectedGroups: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: groupSchema,
    },
    rows: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          group: groupSchema,
          value: { anyOf: [{ type: "integer" }, { type: "null" }] },
        },
        required: ["group", "value"],
      },
    },
    csv: {
      type: "string",
      minLength: 1,
      maxLength: 131072,
      format: "text/csv",
    },
    aggregation: aggregationSchema,
    table: {
      type: "object",
      additionalProperties: false,
      properties: {
        columns: {
          type: "array",
          minItems: 2,
          maxItems: 4,
          items: { type: "string", minLength: 1, maxLength: 16 },
        },
        rows: {
          type: "array",
          minItems: 1,
          maxItems: 32,
          items: {
            type: "array",
            minItems: 2,
            maxItems: 4,
            items: {
              anyOf: [{ type: "string", maxLength: 64 }, { type: "number" }],
            },
          },
        },
      },
      required: ["columns", "rows"],
    },
    missingValueCount: { type: "integer", minimum: 0, maximum: 256 },
    randomness: generatorReplaySchema,
  },
  required: [
    "groupColumns",
    "selectedGroups",
    "rows",
    "csv",
    "aggregation",
    "table",
    "missingValueCount",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is CsvPivotPracticeDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvPivotPracticeDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvPivotPracticeDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      input.categories.some((values) => new Set(values).size !== values.length)
    )
      simpleError(
        "categories",
        "Each category bank must contain distinct values.",
        "duplicate_entries",
      );
    if (input.minimumValue > input.maximumValue)
      simpleError(
        "maximumValue",
        "Numeric value bounds must be ordered.",
        "invalid_value_range",
      );
    if (
      input.categories.some((values) =>
        values.some((value) => value.includes("\u0000")),
      )
    )
      simpleError(
        "categories",
        "NUL is unsupported because the pivot core uses it as a group-key separator.",
        "unsupported_group_separator",
      );
    const population = input.categories.reduce(
      (size, values) => size * values.length,
      1,
    );
    if (
      input.distinctGroupCount > population ||
      input.distinctGroupCount > input.rowCount
    )
      simpleError(
        "distinctGroupCount",
        "The requested distinct groups must fit both the Cartesian universe and row count.",
        "infeasible_group_count",
      );
    const random = createGeneratorRandom(input.seed, context),
      groupColumns = input.categories.map((_, index) => "g" + index);
    const selectedGroups = generatorSampleIndices(
      population,
      input.distinctGroupCount,
      random,
    ).map((index) => {
      let remaining = index;
      const group = Array<string>(input.categories.length);
      for (let column = input.categories.length - 1; column >= 0; column -= 1) {
        group[column] =
          input.categories[column][remaining % input.categories[column].length];
        remaining = Math.floor(remaining / input.categories[column].length);
      }
      return group;
    });
    const assignments = [...selectedGroups];
    while (assignments.length < input.rowCount)
      assignments.push(random.pick(selectedGroups));
    const rows = random.shuffle(assignments).map((group) => ({
      group,
      value:
        random.unit() < input.missingProbability
          ? null
          : random.integer(input.minimumValue, input.maximumValue),
    }));
    const records = rows.map((row) =>
      Object.fromEntries([
        ...groupColumns.map(
          (column, index) => [column, row.group[index]] as const,
        ),
        ["value", row.value] as const,
      ]),
    );
    const csv = calculateJsonToCsv({
      json: JSON.stringify(records),
      delimiter: input.delimiter,
      hasHeader: true,
    }).csv;
    const table = calculatePivot({
      csv,
      delimiter: input.delimiter,
      hasHeader: true,
      groupBy: groupColumns,
      aggregation: input.aggregation,
      valueColumn: "value",
    }).table;
    return toolSuccess({
      groupColumns,
      selectedGroups,
      rows,
      csv,
      aggregation: input.aggregation,
      table,
      missingValueCount: rows.filter((row) => row.value === null).length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvPivotPracticeDatasetExample = {
  input: {
    categories: [["east", "west"]],
    distinctGroupCount: 2,
    rowCount: 4,
    minimumValue: 1,
    maximumValue: 5,
    missingProbability: 0.5,
    aggregation: "sum",
    delimiter: ",",
    seed: 42,
  },
  output: {
    groupColumns: ["g0"],
    selectedGroups: [["west"], ["east"]],
    rows: [
      {
        group: ["east"],
        value: 5,
      },
      {
        group: ["east"],
        value: null,
      },
      {
        group: ["east"],
        value: null,
      },
      {
        group: ["west"],
        value: 4,
      },
    ],
    csv: "g0,value\neast,5\neast,\neast,\nwest,4\n",
    aggregation: "sum",
    table: {
      columns: ["g0", "value_sum"],
      rows: [
        ["east", 5],
        ["west", 4],
      ],
    },
    missingValueCount: 2,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CsvPivotPracticeDatasetInput,
  CsvPivotPracticeDatasetOutput
>;
export const csvPivotPracticeDatasetTool = createModelDefinition<
  CsvPivotPracticeDatasetInput,
  CsvPivotPracticeDatasetOutput
>({
  id: "random/csv-pivot-practice-dataset",
  title: "Random CSV Pivot Practice Dataset Generator",
  description:
    "Construct exact-count repeated categorical groups with seeded integer/missing values, serialize to CSV and delegate count/sum/mean/min/max pivot answers; count includes missing-value rows, other aggregates omit missing values and return zero for all-missing groups, with the core's floating arithmetic and sorted group keys—not a missing cross-tab fill rule.",
  inputSchema,
  outputSchema,
  execute: calculateCsvPivotPracticeDataset,
});
export const runCsvPivotPracticeDataset = csvPivotPracticeDatasetTool.execute;
export default csvPivotPracticeDatasetTool;
