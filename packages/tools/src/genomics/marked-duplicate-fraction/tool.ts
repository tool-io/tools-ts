import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly markedDuplicates: number;
  readonly totalReads: number;
}>;
export type Output = Readonly<{
  readonly duplicatePercent: number;
  readonly unmarkedReadCount: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.markedDuplicates, "markedDuplicates");
  count(input.totalReads, "totalReads", 1);
  if (input.markedDuplicates > input.totalReads)
    simpleError(
      "markedDuplicates",
      "Duplicate reads cannot exceed total reads.",
    );
  return {
    duplicatePercent: (100 * input.markedDuplicates) / input.totalReads,
    unmarkedReadCount: input.totalReads - input.markedDuplicates,
  };
};
export const exampleInput = {
  markedDuplicates: 20,
  totalReads: 100,
} satisfies Input;
export const exampleOutput = {
  duplicatePercent: 20,
  unmarkedReadCount: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markedDuplicates: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    totalReads: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["markedDuplicates", "totalReads"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicatePercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    unmarkedReadCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["duplicatePercent", "unmarkedReadCount"],
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
  id: "genomics/marked-duplicate-fraction",
  title: "Marked Duplicate Fraction",
  description: "Compute marked-duplicate read fraction without assuming unmarked reads are unique molecules.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "markedDuplicates",
        label: "Marked duplicates",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "totalReads",
        label: "Total reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "duplicatePercent",
        label: "Duplicate percent",
        valueType: {
          type: "number",
        },
      },
      {
        id: "unmarkedReadCount",
        label: "Unmarked read count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
