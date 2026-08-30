import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, counts } from "../shared.js";

export type Input = Readonly<{
  readonly binCenters: readonly number[];
  readonly paralogCounts: readonly number[];
  readonly minimumPeakCount: number;
}>;
export type Output = Readonly<{
  readonly peakCenters: readonly number[];
  readonly peakCounts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.binCenters.length;
  counts(input.paralogCounts, "paralogCounts");
  count(input.minimumPeakCount, "minimumPeakCount", 1);
  if (n !== input.paralogCounts.length)
    simpleError("paralogCounts", "Counts must align with age bins.");
  if (input.binCenters.some((v, i) => i > 0 && v <= input.binCenters[i - 1]))
    simpleError("binCenters", "Age bins must be strictly increasing.");
  const indexes: number[] = [];
  for (let i = 1; i < n - 1; i++)
    if (
      input.paralogCounts[i] >= input.minimumPeakCount &&
      input.paralogCounts[i] > input.paralogCounts[i - 1] &&
      input.paralogCounts[i] > input.paralogCounts[i + 1]
    )
      indexes.push(i);
  return {
    peakCenters: indexes.map((i) => input.binCenters[i]),
    peakCounts: indexes.map((i) => input.paralogCounts[i]),
  };
};
export const exampleInput = {
  binCenters: [0.1, 0.2, 0.3, 0.4, 0.5],
  paralogCounts: [1, 5, 2, 6, 1],
  minimumPeakCount: 4,
} satisfies Input;
export const exampleOutput = {
  peakCenters: [0.2, 0.4],
  peakCounts: [5, 6],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    binCenters: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 3,
      maxItems: 100000,
    },
    paralogCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 3,
      maxItems: 100000,
    },
    minimumPeakCount: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["binCenters", "paralogCounts", "minimumPeakCount"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    peakCenters: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 0,
      maxItems: 100000,
      description: "Strict interior maxima above both neighbors and at least minimumPeakCount; edges and plateaus are excluded.",
    },
    peakCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["peakCenters", "peakCounts"],
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
  id: "genomics/paralog-age-peaks",
  title: "Paralog Age Peaks",
  description: "Detect strict interior peaks in a supplied paralog-age histogram as candidate duplication signals.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "binCenters",
        label: "Bin centers",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "paralogCounts",
        label: "Paralog counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumPeakCount",
        label: "Minimum peak count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "peakCenters",
        label: "Peak centers",
        description: "Strict interior maxima above both neighbors and at least minimumPeakCount; edges and plateaus are excluded.",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "peakCounts",
        label: "Peak counts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
