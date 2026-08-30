import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly insertSizesBp: readonly number[];
  readonly minimumMeanBp: number;
  readonly maximumMeanBp: number;
  readonly maximumSdBp: number;
}>;
export type Output = Readonly<{
  readonly meanInsertBp: number;
  readonly sampleSdBp: number;
  readonly withinQcLimits: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.maximumMeanBp < input.minimumMeanBp)
    simpleError("maximumMeanBp", "Maximum mean must be at least the minimum.");
  const n = input.insertSizesBp.length;
  const anchor = input.insertSizesBp.reduce((minimum, v) => Math.min(minimum, v), input.insertSizesBp[0]);
  const meanOffset = input.insertSizesBp.reduce((sum, v) => sum + (v - anchor), 0) / n;
  const meanInsertBp = anchor + meanOffset;
  // Center small offsets before squaring, retaining variance near MAX_SAFE_INTEGER.
  const sampleSdBp = Math.sqrt(input.insertSizesBp.reduce((sum, v) => sum + ((v - anchor) - meanOffset) ** 2, 0) / (n - 1));
  return { meanInsertBp, sampleSdBp, withinQcLimits: meanInsertBp >= input.minimumMeanBp && meanInsertBp <= input.maximumMeanBp && sampleSdBp <= input.maximumSdBp };
};
export const exampleInput = {
  insertSizesBp: [100, 200, 300],
  minimumMeanBp: 150,
  maximumMeanBp: 250,
  maximumSdBp: 120,
} satisfies Input;
export const exampleOutput = {
  meanInsertBp: 200,
  sampleSdBp: 100,
  withinQcLimits: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insertSizesBp: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 2,
      maxItems: 100000,
    },
    minimumMeanBp: {
      type: "number",
      minimum: 0,
    },
    maximumMeanBp: {
      type: "number",
      minimum: 0,
    },
    maximumSdBp: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["insertSizesBp", "minimumMeanBp", "maximumMeanBp", "maximumSdBp"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanInsertBp: {
      type: "number",
      minimum: 0,
    },
    sampleSdBp: {
      type: "number",
      minimum: 0,
    },
    withinQcLimits: {
      type: "boolean",
    },
  },
  required: ["meanInsertBp", "sampleSdBp", "withinQcLimits"],
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
  id: "genomics/insert-size-qc",
  title: "Insert Size QC",
  description: "Summarize insert size using mean and sample standard deviation against explicit QC limits.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "insertSizesBp",
        label: "Insert sizes bp",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumMeanBp",
        label: "Minimum mean bp",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumMeanBp",
        label: "Maximum mean bp",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumSdBp",
        label: "Maximum sd bp",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "meanInsertBp",
        label: "Mean insert bp",
        valueType: {
          type: "number",
        },
      },
      {
        id: "sampleSdBp",
        label: "Sample sd bp",
        valueType: {
          type: "number",
        },
      },
      {
        id: "withinQcLimits",
        label: "Within qc limits",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
