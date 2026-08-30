import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly bamBytes: number;
  readonly cramBytes: number;
}>;
export type Output = Readonly<{
  readonly compressionRatio: number;
  readonly savingsPercent: number;
  readonly savedBytes: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.bamBytes, "bamBytes", 1);
  count(input.cramBytes, "cramBytes", 1);
  return {
    compressionRatio: input.bamBytes / input.cramBytes,
    savingsPercent: (100 * (input.bamBytes - input.cramBytes)) / input.bamBytes,
    savedBytes: input.bamBytes - input.cramBytes,
  };
};
export const exampleInput = { bamBytes: 1000, cramBytes: 400 } satisfies Input;
export const exampleOutput = {
  compressionRatio: 2.5,
  savingsPercent: 60,
  savedBytes: 600,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bamBytes: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    cramBytes: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["bamBytes", "cramBytes"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressionRatio: {
      type: "number",
      exclusiveMinimum: 0,
    },
    savingsPercent: {
      type: "number",
      maximum: 100,
      description: "Signed savings relative to BAM size; negative values represent an increase.",
    },
    savedBytes: {
      type: "integer",
      minimum: -9007199254740991,
      maximum: 9007199254740991,
      description: "BAM bytes minus CRAM bytes; negative when CRAM is larger.",
    },
  },
  required: ["compressionRatio", "savingsPercent", "savedBytes"],
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
  id: "genomics/cram-compression-savings",
  title: "CRAM Compression Savings",
  description: "Compare measured CRAM and BAM byte sizes as compression ratio and storage savings.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "bamBytes",
        label: "Bam bytes",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "cramBytes",
        label: "Cram bytes",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "compressionRatio",
        label: "Compression ratio",
        valueType: {
          type: "number",
        },
      },
      {
        id: "savingsPercent",
        label: "Savings percent",
        description: "Signed savings relative to BAM size; negative values represent an increase.",
        valueType: {
          type: "number",
        },
      },
      {
        id: "savedBytes",
        label: "Saved bytes",
        description: "BAM bytes minus CRAM bytes; negative when CRAM is larger.",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
