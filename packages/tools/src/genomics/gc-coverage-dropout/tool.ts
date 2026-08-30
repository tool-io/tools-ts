import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly gcBinFractions: readonly number[];
  readonly meanDepths: readonly number[];
  readonly minimumExpectedDepth: number;
}>;
export type Output = Readonly<{
  readonly depthDeficitFractions: readonly number[];
  readonly worstGcBin: number;
  readonly maximumDropoutFraction: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.gcBinFractions.length;
  if (
    !n ||
    n !== input.meanDepths.length ||
    input.meanDepths.some((v) => v < 0)
  )
    simpleError(
      "meanDepths",
      "Aligned nonnegative GC-bin mean depths required.",
    );
  input.gcBinFractions.forEach((v) => fraction(v, "gcBinFractions"));
  positive(input.minimumExpectedDepth, "minimumExpectedDepth");
  const depthDeficitFractions = input.meanDepths.map((v) =>
      Math.max(0, 1 - v / input.minimumExpectedDepth),
    ),
    maximumDropoutFraction = depthDeficitFractions.reduce((maximum, v) => Math.max(maximum, v), 0);
  return {
    depthDeficitFractions,
    worstGcBin:
      input.gcBinFractions[
        depthDeficitFractions.indexOf(maximumDropoutFraction)
      ],
    maximumDropoutFraction,
  };
};
export const exampleInput = {
  gcBinFractions: [0.2, 0.5, 0.8],
  meanDepths: [10, 20, 10],
  minimumExpectedDepth: 20,
} satisfies Input;
export const exampleOutput = {
  depthDeficitFractions: [0.5, 0, 0.5],
  worstGcBin: 0.2,
  maximumDropoutFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gcBinFractions: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
    meanDepths: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 1,
      maxItems: 100000,
    },
    minimumExpectedDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
  },
  required: ["gcBinFractions", "meanDepths", "minimumExpectedDepth"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthDeficitFractions: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
    worstGcBin: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    maximumDropoutFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["depthDeficitFractions", "worstGcBin", "maximumDropoutFraction"],
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
  id: "genomics/gc-coverage-dropout",
  title: "GC Coverage Dropout",
  description: "Find GC bins with coverage deficits relative to a caller-supplied expected depth.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "gcBinFractions",
        label: "Gc bin fractions",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "meanDepths",
        label: "Mean depths",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "minimumExpectedDepth",
        label: "Minimum expected depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "depthDeficitFractions",
        label: "Depth deficit fractions",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "worstGcBin",
        label: "Worst gc bin",
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumDropoutFraction",
        label: "Maximum dropout fraction",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
