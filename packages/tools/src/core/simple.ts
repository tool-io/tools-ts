import {
  defineTool,
  type ToolDefinition,
  type ToolJsonSchema,
} from "./definition.js";
import { toolResourceLimits } from "./limits.js";
import { invalidInput, toolSuccess, type ToolResult } from "./result.js";
import type { ToolValueType } from "./value-type.js";

export type SimpleValueKind =
  | "boolean"
  | "bytes"
  | "integer"
  | "matrix"
  | "number"
  | "numberList"
  | "object"
  | "string"
  | "stringList";
export type SimpleField = {
  readonly default?: unknown;
  readonly description?: string;
  readonly enum?: readonly string[];
  readonly format?: string;
  readonly id: string;
  readonly kind: SimpleValueKind;
  readonly label: string;
  readonly maximum?: number;
  readonly minimum?: number;
  readonly required?: boolean;
  readonly unit?: string;
};
export class SimpleToolError extends Error {
  readonly code: string;
  readonly field: string;
  constructor(field: string, message: string, code = "invalid_value") {
    super(message);
    this.code = code;
    this.field = field;
  }
}
export const simpleError = (
  field: string,
  message: string,
  code?: string,
): never => {
  throw new SimpleToolError(field, message, code);
};

const schemaFor = (field: SimpleField): ToolJsonSchema => {
  const limits = {
    ...(field.default === undefined ? {} : { default: field.default }),
    ...(field.description === undefined
      ? {}
      : { description: field.description }),
    ...(field.enum === undefined ? {} : { enum: field.enum }),
    ...(field.maximum === undefined ? {} : { maximum: field.maximum }),
    ...(field.minimum === undefined ? {} : { minimum: field.minimum }),
  };
  if (field.kind === "boolean") return { ...limits, type: "boolean" };
  if (field.kind === "integer") return { ...limits, type: "integer" };
  if (field.kind === "number") return { ...limits, type: "number" };
  if (field.kind === "bytes" || field.kind === "string")
    return { ...limits, type: "string" };
  if (field.kind === "numberList")
    return { ...limits, items: { type: "number" }, type: "array" };
  if (field.kind === "stringList")
    return { ...limits, items: { type: "string" }, type: "array" };
  if (field.kind === "matrix")
    return {
      ...limits,
      items: { items: { type: "number" }, type: "array" },
      type: "array",
    };
  return { ...limits, additionalProperties: true, type: "object" };
};
const valueTypeFor = (field: SimpleField): ToolValueType => {
  const metadata = {
    ...(field.format === undefined ? {} : { format: field.format }),
    ...(field.unit === undefined ? {} : { unit: field.unit }),
  };
  if (field.kind === "bytes") return { ...metadata, type: "bytes" };
  if (field.kind === "boolean") return { ...metadata, type: "boolean" };
  if (field.kind === "integer") return { ...metadata, type: "integer" };
  if (field.kind === "number") return { ...metadata, type: "number" };
  if (field.kind === "string") return { ...metadata, type: "string" };
  if (field.kind === "numberList")
    return { ...metadata, items: { type: "number" }, type: "list" };
  if (field.kind === "stringList")
    return { ...metadata, items: { type: "string" }, type: "list" };
  if (field.kind === "matrix")
    return {
      ...metadata,
      items: { items: { type: "number" }, type: "list" },
      type: "list",
    };
  return { ...metadata, type: "object" };
};
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const validValue = (value: unknown, field: SimpleField): boolean => {
  if (value === undefined)
    return field.required === false || field.default !== undefined;
  if (field.enum && !field.enum.includes(String(value))) return false;
  if (field.kind === "number" || field.kind === "integer")
    return (
      typeof value === "number" &&
      Number.isFinite(value) &&
      (field.kind !== "integer" || Number.isSafeInteger(value)) &&
      (field.minimum === undefined || value >= field.minimum) &&
      (field.maximum === undefined || value <= field.maximum)
    );
  if (field.kind === "string" || field.kind === "bytes")
    return (
      typeof value === "string" &&
      value.length <= toolResourceLimits.textCharacters
    );
  if (field.kind === "boolean") return typeof value === "boolean";
  if (field.kind === "object") return isRecord(value);
  if (field.kind === "numberList")
    return (
      Array.isArray(value) &&
      value.length <= toolResourceLimits.generatedValues &&
      value.every(
        (entry) => typeof entry === "number" && Number.isFinite(entry),
      )
    );
  if (field.kind === "stringList")
    return (
      Array.isArray(value) &&
      value.length <= toolResourceLimits.generatedValues &&
      value.every(
        (entry) =>
          typeof entry === "string" &&
          entry.length <= toolResourceLimits.textCharacters,
      )
    );
  return (
    Array.isArray(value) &&
    value.length <= toolResourceLimits.matrixDimension &&
    value.every(
      (row) =>
        Array.isArray(row) &&
        row.length <= toolResourceLimits.matrixDimension &&
        row.every(
          (entry) => typeof entry === "number" && Number.isFinite(entry),
        ),
    )
  );
};

export type SimpleToolConfig = {
  readonly calculate: (
    input: Readonly<Record<string, unknown>>,
  ) => Readonly<Record<string, unknown>>;
  readonly description: string;
  readonly id: string;
  readonly inputs: readonly SimpleField[];
  readonly outputs: readonly SimpleField[];
  readonly title: string;
};
export const createSimpleTool = (
  config: SimpleToolConfig,
): ToolDefinition<Record<string, unknown>, Record<string, unknown>> => {
  const inputProperties = Object.fromEntries(
    config.inputs.map((field) => [field.id, schemaFor(field)]),
  );
  const outputProperties = Object.fromEntries(
    config.outputs.map((field) => [field.id, schemaFor(field)]),
  );
  const requiredInputs = config.inputs
    .filter((field) => field.required !== false && field.default === undefined)
    .map((field) => field.id);
  const execute = (input: unknown): ToolResult<Record<string, unknown>> => {
    if (!isRecord(input))
      return invalidInput([
        {
          code: "object_required",
          field: "",
          message: "Input must be an object.",
        },
      ]);
    const normalized: Record<string, unknown> = { ...input };
    for (const field of config.inputs) {
      if (normalized[field.id] === undefined && field.default !== undefined)
        normalized[field.id] = field.default;
      if (!validValue(normalized[field.id], field))
        return invalidInput([
          {
            code: "invalid_field",
            field: field.id,
            message: `${field.label} is invalid.`,
          },
        ]);
    }
    try {
      const output = config.calculate(normalized);
      for (const field of config.outputs)
        if (!validValue(output[field.id], field))
          simpleError(
            field.id,
            `${field.label} could not be calculated.`,
            "invalid_output",
          );
      return toolSuccess(output);
    } catch (error) {
      return error instanceof SimpleToolError
        ? invalidInput([
            { code: error.code, field: error.field, message: error.message },
          ])
        : invalidInput([
            {
              code: "calculation_failed",
              field: "",
              message: "The calculation could not be completed.",
            },
          ]);
    }
  };
  return defineTool({
    contractVersion: 1,
    description: config.description,
    execute,
    execution: { kind: "pure" },
    id: config.id,
    inputSchema: {
      additionalProperties: false,
      properties: inputProperties,
      required: requiredInputs,
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: outputProperties,
      required: config.outputs.map((field) => field.id),
      type: "object",
    },
    ports: {
      inputs: config.inputs.map((field) => ({
        ...(field.description === undefined
          ? {}
          : { description: field.description }),
        id: field.id,
        label: field.label,
        required: requiredInputs.includes(field.id),
        valueType: valueTypeFor(field),
      })),
      outputs: config.outputs.map((field) => ({
        ...(field.description === undefined
          ? {}
          : { description: field.description }),
        id: field.id,
        label: field.label,
        valueType: valueTypeFor(field),
      })),
    },
    title: config.title,
  });
};
