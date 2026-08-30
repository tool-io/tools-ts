import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly insertionCount: number;
  readonly deletionCount: number;
  readonly callableBases: number;
}>;
export type Output = Readonly<{
  readonly totalIndels: number;
  readonly indelsPerKilobase: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.insertionCount, "insertionCount");
  count(input.deletionCount, "deletionCount");
  count(input.callableBases, "callableBases", 1);
  const totalIndels = input.insertionCount + input.deletionCount;
  if (!Number.isSafeInteger(totalIndels))
    simpleError("deletionCount", "Total indel count exceeds the safe integer range.", "count_overflow");
  return {
    totalIndels,
    indelsPerKilobase: (1000 * totalIndels) / input.callableBases,
  };
};
export const exampleInput = {
  insertionCount: 10,
  deletionCount: 5,
  callableBases: 10000,
} satisfies Input;
export const exampleOutput = {
  totalIndels: 15,
  indelsPerKilobase: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insertionCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    deletionCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    callableBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["insertionCount", "deletionCount", "callableBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalIndels: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    indelsPerKilobase: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["totalIndels", "indelsPerKilobase"],
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
  id: "genomics/indel-density",
  title: "Indel Density",
  description: "Compute insertion-plus-deletion variant density per callable kilobase.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "insertionCount",
        label: "Insertion count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "deletionCount",
        label: "Deletion count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "callableBases",
        label: "Callable bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "totalIndels",
        label: "Total indels",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "indelsPerKilobase",
        label: "Indels per kilobase",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
