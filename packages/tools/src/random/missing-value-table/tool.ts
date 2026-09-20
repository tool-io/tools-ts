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

export type MissingValueTableInput = {
  readonly rowCount: number;
  readonly columns: readonly GeneratedField[];
  readonly delimiter: "," | ";" | "\t" | "|";
  readonly missingProbability: number;
  readonly seed?: number;
};
export type MissingValueTableOutput = {
  readonly completeRecords: readonly Readonly<
    Record<string, GeneratedPrimitive>
  >[];
  readonly missingMask: readonly (readonly boolean[])[];
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
    missingProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: ["rowCount", "columns", "delimiter", "missingProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeRecords: generatedRecordsSchema,
    missingMask: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 16,
        items: { type: "boolean" },
      },
    },
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
  required: [
    "completeRecords",
    "missingMask",
    "records",
    "table",
    "csv",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is MissingValueTableInput =>
  matchesModelInput(input, inputSchema);
export const calculateMissingValueTable = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MissingValueTableOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    validateGeneratedColumns(input.columns);
    const random = createGeneratorRandom(input.seed, context),
      completeRecords = generatePrimitiveRecords(
        input.columns,
        input.rowCount,
        random,
      );
    const missingMask = completeRecords.map(() =>
      input.columns.map(() => random.unit() < input.missingProbability),
    );
    const records = completeRecords.map((record, row) =>
      Object.fromEntries(
        input.columns.map((column, col) => [
          column.key,
          missingMask[row][col] ? null : record[column.key],
        ]),
      ),
    );
    const serialized = serializeGeneratedRecords(records, input.delimiter);
    return toolSuccess({
      completeRecords,
      missingMask,
      records,
      ...serialized,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const missingValueTableExample = {
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
    missingProbability: 0.35,
    seed: 42,
  },
  output: {
    completeRecords: [
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
    missingMask: [
      [false, true, false],
      [false, true, true],
      [false, false, false],
    ],
    records: [
      {
        name: "Grace",
        age: null,
        active: false,
      },
      {
        name: "Lin",
        age: null,
        active: null,
      },
      {
        name: "Ada",
        age: 45,
        active: false,
      },
    ],
    csv: "name,age,active\nGrace,,false\nLin,,\nAda,45,false\n",
    table: {
      kind: "tool.io/table",
      rows: [
        ["Grace", null, false],
        ["Lin", null, null],
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
            nullable: true,
          },
          {
            dataType: {
              kind: "boolean",
            },
            id: "active",
            label: "active",
            nullable: true,
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
} satisfies ToolExample<MissingValueTableInput, MissingValueTableOutput>;
export const missingValueTableTool = createModelDefinition<
  MissingValueTableInput,
  MissingValueTableOutput
>({
  id: "random/missing-value-table",
  title: "Random Missing-Value Table Generator",
  description:
    "Generate typed primitive records, inject explicit independent null cells with a retained baseline and mask, then delegate canonical TableData and LF-terminated CSV serialization; not a model of real missingness or spreadsheet formula sanitization.",
  inputSchema,
  outputSchema,
  execute: calculateMissingValueTable,
});
export const runMissingValueTable = missingValueTableTool.execute;
export default missingValueTableTool;
