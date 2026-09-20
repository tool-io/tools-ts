import { simpleError } from "../core/simple.js";
import { calculateJsonToCsv } from "../convert/json-to-csv/tool.js";
import { calculateJsonToTable } from "../convert/json-to-table/tool.js";
import type { TableData } from "../table/definition.js";
import type { GeneratorRandom } from "./generator-random.js";
export type GeneratedPrimitive = string | number | boolean | null;
export type GeneratedField =
  | {
      readonly key: string;
      readonly kind: "integer";
      readonly minimum: number;
      readonly maximum: number;
    }
  | {
      readonly key: string;
      readonly kind: "number";
      readonly minimum: number;
      readonly maximum: number;
    }
  | {
      readonly key: string;
      readonly kind: "text";
      readonly choices: readonly string[];
    }
  | {
      readonly key: string;
      readonly kind: "boolean";
      readonly trueProbability: number;
    };
const keySchema = { type: "string", minLength: 1, maxLength: 263 } as const;
const numericFields = {
  key: keySchema,
  minimum: { type: "number" },
  maximum: { type: "number" },
} as const;
export const generatedFieldSchema = {
  type: "object",
  additionalProperties: true,
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        ...numericFields,
        kind: { type: "string", const: "integer" },
        minimum: { type: "integer" },
        maximum: { type: "integer" },
      },
      required: ["key", "kind", "minimum", "maximum"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        ...numericFields,
        kind: { type: "string", const: "number" },
      },
      required: ["key", "kind", "minimum", "maximum"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        key: keySchema,
        kind: { type: "string", const: "text" },
        choices: {
          type: "array",
          minItems: 1,
          maxItems: 32,
          items: { type: "string", maxLength: 128 },
        },
      },
      required: ["key", "kind", "choices"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        key: keySchema,
        kind: { type: "string", const: "boolean" },
        trueProbability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["key", "kind", "trueProbability"],
    },
  ],
} as const;
export const generatedFieldsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 64,
  items: generatedFieldSchema,
} as const;
export const generatedPrimitiveSchema = {
  anyOf: [
    { type: "string", maxLength: 128 },
    { type: "number" },
    { type: "boolean" },
    { type: "null" },
  ],
} as const;
export const generatedRecordsSchema = {
  type: "array",
  minItems: 1,
  maxItems: 256,
  items: { type: "object", additionalProperties: generatedPrimitiveSchema },
} as const;
const inferredDataType = {
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", enum: ["boolean", "date", "json", "string"] },
      },
      required: ["kind"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", const: "integer" },
        bits: { type: "integer", const: 64 },
        signed: { type: "boolean", const: true },
      },
      required: ["kind", "bits", "signed"],
    },
    {
      type: "object",
      additionalProperties: false,
      properties: {
        kind: { type: "string", const: "float" },
        bits: { type: "integer", const: 64 },
      },
      required: ["kind", "bits"],
    },
  ],
} as const;
/** The primitive-only subset emitted by the existing JSON-to-table adapter. */
export const generatedTableSchema = {
  type: "object",
  format: "tool.io/table",
  additionalProperties: false,
  properties: {
    kind: { type: "string", const: "tool.io/table" },
    version: { type: "integer", const: 1 },
    rows: {
      type: "array",
      minItems: 1,
      maxItems: 256,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 16,
        items: generatedPrimitiveSchema,
      },
    },
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fields: {
          type: "array",
          minItems: 1,
          maxItems: 16,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              dataType: inferredDataType,
              id: { type: "string", minLength: 1, maxLength: 64 },
              label: { type: "string", minLength: 1, maxLength: 32 },
              nullable: { type: "boolean" },
            },
            required: ["dataType", "id", "label", "nullable"],
          },
        },
      },
      required: ["fields"],
    },
  },
  required: ["kind", "version", "rows", "schema"],
} as const;
export const validateGeneratedFields = (
  fields: readonly GeneratedField[],
  field: string,
): void => {
  if (new Set(fields.map((entry) => entry.key)).size !== fields.length)
    simpleError(
      field,
      "Template keys must be distinct.",
      "duplicate_field_keys",
    );
  for (const entry of fields) {
    if (entry.kind === "integer") {
      if (
        !Number.isSafeInteger(entry.minimum) ||
        !Number.isSafeInteger(entry.maximum)
      )
        simpleError(
          field,
          "Integer bounds must be safe integers.",
          "invalid_integer_range",
        );
      if (
        entry.maximum < entry.minimum ||
        !Number.isSafeInteger(entry.maximum - entry.minimum + 1)
      )
        simpleError(
          field,
          "Integer bounds must form an ordered safe inclusive range.",
          "invalid_integer_range",
        );
    } else if (
      entry.kind === "number" &&
      (entry.maximum < entry.minimum ||
        !Number.isFinite(entry.maximum - entry.minimum))
    )
      simpleError(
        field,
        "Numeric bounds need an ordered finite span.",
        "invalid_number_range",
      );
  }
};
export const validateGeneratedColumns = (
  fields: readonly GeneratedField[],
): void => {
  validateGeneratedFields(fields, "columns");
  if (
    fields.some(
      (entry) => !/^[A-Za-z_][A-Za-z0-9_]{0,31}(?![\s\S])/.test(entry.key),
    )
  )
    simpleError(
      "columns",
      "This serializer-safe version uses 1–32-character ASCII identifier headers.",
      "unsupported_column_name",
    );
};
export const generateFieldValue = (
  entry: GeneratedField,
  random: GeneratorRandom,
  field = "columns",
): Exclude<GeneratedPrimitive, null> => {
  if (entry.kind === "integer")
    return random.integer(entry.minimum, entry.maximum);
  if (entry.kind === "text") return random.pick(entry.choices);
  if (entry.kind === "boolean") return random.unit() < entry.trueProbability;
  const value = entry.minimum + (entry.maximum - entry.minimum) * random.unit();
  if (!Number.isFinite(value) || value < entry.minimum || value > entry.maximum)
    return simpleError(
      field,
      "A generated number left its finite interval.",
      "numeric_overflow",
    );
  return value === 0 ? 0 : value;
};
export const generatePrimitiveRecords = (
  fields: readonly GeneratedField[],
  count: number,
  random: GeneratorRandom,
): Record<string, GeneratedPrimitive>[] =>
  Array.from({ length: count }, () =>
    Object.fromEntries(
      fields.map((entry) => [entry.key, generateFieldValue(entry, random)]),
    ),
  );
export const serializeGeneratedRecords = (
  records: readonly Readonly<Record<string, GeneratedPrimitive>>[],
  delimiter: string,
): { table: TableData; csv: string } => {
  const json = JSON.stringify(records);
  return {
    table: calculateJsonToTable({ json }).table,
    csv: calculateJsonToCsv({ json, delimiter, hasHeader: true }).csv,
  };
};
