import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly variantIds: readonly string[];
  readonly databaseVariantIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly novelVariantIds: readonly string[];
  readonly novelPercent: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (
    !input.variantIds.length ||
    new Set(input.variantIds).size !== input.variantIds.length
  )
    simpleError("variantIds", "Distinct called variant IDs required.");
  const known = new Set(input.databaseVariantIds),
    novelVariantIds = input.variantIds.filter((v) => !known.has(v));
  return {
    novelVariantIds,
    novelPercent: (100 * novelVariantIds.length) / input.variantIds.length,
  };
};
export const exampleInput = {
  variantIds: ["A", "B", "C"],
  databaseVariantIds: ["B"],
} satisfies Input;
export const exampleOutput = {
  novelVariantIds: ["A", "C"],
  novelPercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variantIds: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 1,
      maxItems: 100000,
    },
    databaseVariantIds: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["variantIds", "databaseVariantIds"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    novelVariantIds: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 0,
      maxItems: 100000,
    },
    novelPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["novelVariantIds", "novelPercent"],
} as const satisfies ToolJsonSchema;

// The shared schema matcher uses Array.every, which skips holes; reject sparse lists explicitly.
const matchesDenseSchema = (value: unknown, schema: ToolJsonSchema): boolean => {
  if (!matchesToolJsonSchema(value, schema)) return false;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (!Object.hasOwn(value, i)) return false;
      if (schema.items && !matchesDenseSchema(value[i], schema.items)) return false;
    }
  } else if (typeof value === "object" && value !== null && schema.properties) {
    const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
    for (const [field, fieldSchema] of Object.entries(schema.properties))
      if (!matchesDenseSchema(fields.get(field), fieldSchema)) return false;
  }
  return true;
};

function validateInput(value: unknown): asserts value is Input {
  if (matchesDenseSchema(value, inputSchema)) return;
  if (typeof value !== "object" || value === null || Array.isArray(value))
    simpleError("", "Input must be an object.", "object_required");
  const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
  for (const field of fields.keys())
    if (!Object.hasOwn(inputSchema.properties, field))
      simpleError(field, `${field} is not a supported input field.`, "unknown_field");
  for (const [field, schema] of Object.entries(inputSchema.properties))
    if (!matchesDenseSchema(fields.get(field), schema))
      simpleError(field, `${field} does not match the declared input schema.`, "invalid_field");
  simpleError("", "Input does not match the tool schema.", "invalid_field");
}

export const run = (input: unknown): ToolResult<Output> => {
  try {
    validateInput(input);
    const output = calculate(input);
    if (!matchesDenseSchema(output, outputSchema))
      throw new Error("Calculation produced output outside its declared schema.");
    return toolSuccess(output);
  } catch (error) {
    if (!(error instanceof SimpleToolError)) throw error;
    return invalidInput([{ code: error.code, field: error.field, message: error.message }]);
  }
};

export const tool = defineTool<Input, Output>({
  contractVersion: 1,
  id: "genomics/novel-variant-fraction",
  title: "Novel Variant Fraction",
  description: "Calculate variants absent from a supplied reference ID set; requires harmonized variant representation.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "variantIds",
        label: "Variant ids",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "databaseVariantIds",
        label: "Database variant ids",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
    ],
    outputs: [
      {
        id: "novelVariantIds",
        label: "Novel variant ids",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "novelPercent",
        label: "Novel percent",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
