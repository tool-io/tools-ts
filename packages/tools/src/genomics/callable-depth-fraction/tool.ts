import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, positive, counts } from "../shared.js";

export type Input = Readonly<{
  readonly depthValues: readonly number[];
  readonly baseCounts: readonly number[];
  readonly minimumDepth: number;
}>;
export type Output = Readonly<{
  readonly callableBases: number;
  readonly totalBases: number;
  readonly callablePercent: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.depthValues.length !== input.baseCounts.length)
    simpleError("baseCounts", "Base counts must align with depth bins.");
  if (new Set(input.depthValues).size !== input.depthValues.length)
    simpleError("depthValues", "Depth bins must be distinct.");
  const totalBases = input.baseCounts.reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(totalBases))
    simpleError("baseCounts", "Total base count exceeds the safe integer range.", "count_overflow");
  positive(totalBases, "baseCounts");
  const callableBases = input.depthValues.reduce((sum, v, i) => sum + (v >= input.minimumDepth ? input.baseCounts[i] : 0), 0);
  return { callableBases, totalBases, callablePercent: (100 * callableBases) / totalBases };
};
export const exampleInput = {
  depthValues: [0, 10, 20],
  baseCounts: [5, 10, 5],
  minimumDepth: 10,
} satisfies Input;
export const exampleOutput = {
  callableBases: 15,
  totalBases: 20,
  callablePercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthValues: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    baseCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    minimumDepth: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["depthValues", "baseCounts", "minimumDepth"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callableBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    totalBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    callablePercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["callableBases", "totalBases", "callablePercent"],
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
  id: "genomics/callable-depth-fraction",
  title: "Callable Depth Fraction",
  description: "Calculate callable-base percentage from a depth histogram and minimum calling depth.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "depthValues",
        label: "Depth values",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "baseCounts",
        label: "Base counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumDepth",
        label: "Minimum depth",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "callableBases",
        label: "Callable bases",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "totalBases",
        label: "Total bases",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "callablePercent",
        label: "Callable percent",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
