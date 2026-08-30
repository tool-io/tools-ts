import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive, counts } from "../shared.js";

export type Input = Readonly<{
  readonly depths: readonly number[];
  readonly baseCounts: readonly number[];
  readonly minimumMeanFraction: number;
  readonly maximumMeanFraction: number;
}>;
export type Output = Readonly<{
  readonly meanDepth: number;
  readonly withinBandBases: number;
  readonly withinBandPercent: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.depths.length !== input.baseCounts.length)
    simpleError("baseCounts", "Base counts must align with depth bins.");
  if (input.maximumMeanFraction < input.minimumMeanFraction)
    simpleError("maximumMeanFraction", "Maximum fraction must be at least the minimum.");
  const total = input.baseCounts.reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(total))
    simpleError("baseCounts", "Total base count exceeds the safe integer range.", "count_overflow");
  positive(total, "baseCounts");
  const anchor = input.depths.reduce((minimum, v) => Math.min(minimum, v), input.depths[0]);
  const meanDepth = anchor + input.depths.reduce((sum, v, i) => sum + (v - anchor) * input.baseCounts[i], 0) / total;
  positive(meanDepth, "depths");
  const withinBandBases = input.depths.reduce((sum, v, i) => sum + (v >= meanDepth * input.minimumMeanFraction && v <= meanDepth * input.maximumMeanFraction ? input.baseCounts[i] : 0), 0);
  return { meanDepth, withinBandBases, withinBandPercent: (100 * withinBandBases) / total };
};
export const exampleInput = {
  depths: [0, 10, 20],
  baseCounts: [1, 2, 1],
  minimumMeanFraction: 0.5,
  maximumMeanFraction: 1.5,
} satisfies Input;
export const exampleOutput = {
  meanDepth: 10,
  withinBandBases: 2,
  withinBandPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depths: {
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
    minimumMeanFraction: {
      type: "number",
      minimum: 0,
    },
    maximumMeanFraction: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["depths", "baseCounts", "minimumMeanFraction", "maximumMeanFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
    withinBandBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    withinBandPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["meanDepth", "withinBandBases", "withinBandPercent"],
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
  id: "genomics/depth-band-uniformity",
  title: "Depth Band Uniformity",
  description: "Measure the fraction of covered bases within a caller-defined band around mean depth.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "depths",
        label: "Depths",
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
        id: "minimumMeanFraction",
        label: "Minimum mean fraction",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumMeanFraction",
        label: "Maximum mean fraction",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "meanDepth",
        label: "Mean depth",
        valueType: {
          type: "number",
        },
      },
      {
        id: "withinBandBases",
        label: "Within band bases",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "withinBandPercent",
        label: "Within band percent",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
