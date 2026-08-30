import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly variantIds: readonly string[];
  readonly targetAlternateDosages: readonly number[];
  readonly otherSampleAlternateAlleles: readonly number[];
}>;
export type Output = Readonly<{
  readonly privateSingletonIds: readonly string[];
  readonly singletonCount: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.variantIds.length;
  counts(input.targetAlternateDosages, "targetAlternateDosages", true);
  counts(
    input.otherSampleAlternateAlleles,
    "otherSampleAlternateAlleles",
    true,
  );
  if (n !== input.targetAlternateDosages.length)
    simpleError("targetAlternateDosages", "Target dosages must align with variants.");
  if (n !== input.otherSampleAlternateAlleles.length)
    simpleError("otherSampleAlternateAlleles", "Other-sample counts must align with variants.");
  if (new Set(input.variantIds).size !== n)
    simpleError("variantIds", "Variant identifiers must be distinct.");
  const privateSingletonIds = input.variantIds.filter(
    (_, i) =>
      input.targetAlternateDosages[i] === 1 &&
      input.otherSampleAlternateAlleles[i] === 0,
  );
  return { privateSingletonIds, singletonCount: privateSingletonIds.length };
};
export const exampleInput = {
  variantIds: ["v1", "v2", "v3"],
  targetAlternateDosages: [1, 2, 1],
  otherSampleAlternateAlleles: [0, 0, 2],
} satisfies Input;
export const exampleOutput = {
  privateSingletonIds: ["v1"],
  singletonCount: 1,
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
      minItems: 0,
      maxItems: 100000,
    },
    targetAlternateDosages: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 2,
      },
      minItems: 0,
      maxItems: 100000,
    },
    otherSampleAlternateAlleles: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["variantIds", "targetAlternateDosages", "otherSampleAlternateAlleles"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    privateSingletonIds: {
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
    singletonCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["privateSingletonIds", "singletonCount"],
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
  id: "genomics/private-singleton-tally",
  title: "Private Singleton Tally",
  description: "Identify alternate alleles seen exactly once in the target and absent from all other samples.",
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
        id: "targetAlternateDosages",
        label: "Target alternate dosages",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "otherSampleAlternateAlleles",
        label: "Other sample alternate alleles",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "privateSingletonIds",
        label: "Private singleton ids",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "singletonCount",
        label: "Singleton count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
