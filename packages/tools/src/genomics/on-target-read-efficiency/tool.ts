import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly onTargetReads: number;
  readonly totalMappedReads: number;
}>;
export type Output = Readonly<{
  readonly onTargetPercent: number;
  readonly offTargetReads: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.onTargetReads, "onTargetReads");
  count(input.totalMappedReads, "totalMappedReads", 1);
  if (input.onTargetReads > input.totalMappedReads)
    simpleError("onTargetReads", "On-target reads cannot exceed mapped reads.");
  return {
    onTargetPercent: (100 * input.onTargetReads) / input.totalMappedReads,
    offTargetReads: input.totalMappedReads - input.onTargetReads,
  };
};
export const exampleInput = {
  onTargetReads: 800,
  totalMappedReads: 1000,
} satisfies Input;
export const exampleOutput = {
  onTargetPercent: 80,
  offTargetReads: 200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onTargetReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    totalMappedReads: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["onTargetReads", "totalMappedReads"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onTargetPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    offTargetReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["onTargetPercent", "offTargetReads"],
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
  id: "genomics/on-target-read-efficiency",
  title: "On Target Read Efficiency",
  description: "Compute capture efficiency as the fraction of mapped reads overlapping targets.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "onTargetReads",
        label: "On target reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "totalMappedReads",
        label: "Total mapped reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "onTargetPercent",
        label: "On target percent",
        valueType: {
          type: "number",
        },
      },
      {
        id: "offTargetReads",
        label: "Off target reads",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
