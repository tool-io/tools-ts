import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, counts } from "../shared.js";

export type Input = Readonly<{
  readonly variantSizesBp: readonly number[];
  readonly svMinimumBp: number;
  readonly largeVariantMinimumBp: number;
}>;
export type Output = Readonly<{
  readonly sizeClasses: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.variantSizesBp, "variantSizesBp");
  count(input.svMinimumBp, "svMinimumBp", 1);
  count(input.largeVariantMinimumBp, "largeVariantMinimumBp", 1);
  if (input.largeVariantMinimumBp <= input.svMinimumBp)
    simpleError(
      "largeVariantMinimumBp",
      "Large-variant cutoff must exceed structural-variant cutoff.",
    );
  return {
    sizeClasses: input.variantSizesBp.map((v) =>
      v < input.svMinimumBp
        ? "small"
        : v < input.largeVariantMinimumBp
          ? "structural"
          : "large-structural",
    ),
  };
};
export const exampleInput = {
  variantSizesBp: [10, 100, 2000000],
  svMinimumBp: 50,
  largeVariantMinimumBp: 1000000,
} satisfies Input;
export const exampleOutput = {
  sizeClasses: ["small", "structural", "large-structural"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variantSizesBp: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    svMinimumBp: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
      description: "Sizes at this inclusive boundary enter the structural class.",
    },
    largeVariantMinimumBp: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
      description: "Sizes at this inclusive boundary enter the large class; must exceed svMinimumBp.",
    },
  },
  required: ["variantSizesBp", "svMinimumBp", "largeVariantMinimumBp"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sizeClasses: {
      type: "array",
      items: {
        type: "string",
        enum: ["small", "structural", "large-structural"],
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["sizeClasses"],
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
  id: "genomics/structural-variant-size-bands",
  title: "Structural Variant Size Bands",
  description: "Classify structural variant sizes using caller-specified base-pair boundaries.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "variantSizesBp",
        label: "Variant sizes bp",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "svMinimumBp",
        label: "Sv minimum bp",
        required: true,
        description: "Sizes at this inclusive boundary enter the structural class.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "largeVariantMinimumBp",
        label: "Large variant minimum bp",
        required: true,
        description: "Sizes at this inclusive boundary enter the large class; must exceed svMinimumBp.",
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "sizeClasses",
        label: "Size classes",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
