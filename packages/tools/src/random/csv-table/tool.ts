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
  generatedFieldsSchema,
  generatedRecordsSchema,
  generatedTableSchema,
  validateGeneratedColumns,
  generatePrimitiveRecords,
  serializeGeneratedRecords,
  type GeneratedField,
  type GeneratedPrimitive,
} from "../typed-field-generation.js";
import type { TableData } from "../../table/definition.js";

export type CsvTableInput = {
  readonly rowCount: number;
  readonly columns: readonly GeneratedField[];
  readonly delimiter: "," | ";" | "\t" | "|";
  readonly seed?: number;
};
export type CsvTableOutput = {
  readonly records: readonly Readonly<Record<string, GeneratedPrimitive>>[];
  readonly table: TableData;
  readonly csv: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowCount: { type: "integer", minimum: 1, maximum: 256 },
    columns: { ...generatedFieldsSchema, maxItems: 16 },
    delimiter: { type: "string", enum: [",", ";", "\t", "|"] },
    seed: generatorSeedSchema,
  },
  required: ["rowCount", "columns", "delimiter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    records: generatedRecordsSchema,
    table: generatedTableSchema,
    csv: {
      type: "string",
      minLength: 1,
      maxLength: 1100000,
      format: "text/csv",
    },
    randomness: generatorReplaySchema,
  },
  required: ["records", "table", "csv", "randomness"],
} as const;

const isInput = (input: unknown): input is CsvTableInput =>
  matchesModelInput(input, inputSchema);
export const calculateCsvTable = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CsvTableOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    validateGeneratedColumns(input.columns);
    const random = createGeneratorRandom(input.seed, context),
      records = generatePrimitiveRecords(input.columns, input.rowCount, random);

    const serialized = serializeGeneratedRecords(records, input.delimiter);
    return toolSuccess({
      records,
      ...serialized,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const csvTableExample = {
  input: {
    rowCount: 3,
    columns: [
      {
        key: "name",
        kind: "text",
        choices: ["Ada", "Grace", "Lin"],
      },
      {
        key: "age",
        kind: "integer",
        minimum: 20,
        maximum: 60,
      },
      {
        key: "active",
        kind: "boolean",
        trueProbability: 0.7,
      },
    ],
    delimiter: ",",
    seed: 42,
  },
  output: {
    records: [
      {
        name: "Grace",
        age: 38,
        active: false,
      },
      {
        name: "Lin",
        age: 27,
        active: true,
      },
      {
        name: "Ada",
        age: 45,
        active: false,
      },
    ],
    csv: "name,age,active\nGrace,38,false\nLin,27,true\nAda,45,false\n",
    table: {
      kind: "tool.io/table",
      rows: [
        ["Grace", 38, false],
        ["Lin", 27, true],
        ["Ada", 45, false],
      ],
      schema: {
        fields: [
          {
            dataType: {
              kind: "string",
            },
            id: "name",
            label: "name",
            nullable: false,
          },
          {
            dataType: {
              bits: 64,
              kind: "integer",
              signed: true,
            },
            id: "age",
            label: "age",
            nullable: false,
          },
          {
            dataType: {
              kind: "boolean",
            },
            id: "active",
            label: "active",
            nullable: false,
          },
        ],
      },
      version: 1,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CsvTableInput, CsvTableOutput>;
export const csvTableTool = createModelDefinition<
  CsvTableInput,
  CsvTableOutput
>({
  id: "random/csv-table",
  title: "Random CSV Table Generator",
  description:
    "Generate exact-count primitive records from explicit bounded integer/number/text/Boolean templates, then delegate TableData and LF-terminated CSV serialization; ASCII identifier headers avoid the converter's unquoted-header limitation and cell text is not spreadsheet-sanitized.",
  inputSchema,
  outputSchema,
  execute: calculateCsvTable,
});
export const runCsvTable = csvTableTool.execute;
export default csvTableTool;
