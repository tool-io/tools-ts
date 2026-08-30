import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly nonsynonymousRate: number;
  readonly synonymousRate: number;
  readonly neutralTolerance: number;
}>;
export type Output = Readonly<{
  readonly kaksRatio: number;
  readonly selectionBand: string;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.nonsynonymousRate < 0)
    simpleError("nonsynonymousRate", "Nonnegative rate required.");
  positive(input.synonymousRate, "synonymousRate");
  fraction(input.neutralTolerance, "neutralTolerance");
  const kaksRatio = input.nonsynonymousRate / input.synonymousRate;
  if (!Number.isFinite(kaksRatio))
    simpleError("synonymousRate", "Ka/Ks ratio exceeds the finite number range.", "result_overflow");
  return {
    kaksRatio,
    selectionBand:
      kaksRatio < 1 - input.neutralTolerance
        ? "below-neutral"
        : kaksRatio > 1 + input.neutralTolerance
          ? "above-neutral"
          : "near-neutral",
  };
};
export const exampleInput = {
  nonsynonymousRate: 0.02,
  synonymousRate: 0.1,
  neutralTolerance: 0.1,
} satisfies Input;
export const exampleOutput = {
  kaksRatio: 0.19999999999999998,
  selectionBand: "below-neutral",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonsynonymousRate: {
      type: "number",
      minimum: 0,
    },
    synonymousRate: {
      type: "number",
      exclusiveMinimum: 0,
    },
    neutralTolerance: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["nonsynonymousRate", "synonymousRate", "neutralTolerance"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kaksRatio: {
      type: "number",
      minimum: 0,
    },
    selectionBand: {
      type: "string",
      enum: ["below-neutral", "near-neutral", "above-neutral"],
    },
  },
  required: ["kaksRatio", "selectionBand"],
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
  id: "genomics/kaks-selection-screen",
  title: "Kaks Selection Screen",
  description: "Screen a Ka/Ks ratio relative to a caller-defined neutral band without claiming statistical significance.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "nonsynonymousRate",
        label: "Nonsynonymous rate",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "synonymousRate",
        label: "Synonymous rate",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "neutralTolerance",
        label: "Neutral tolerance",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "kaksRatio",
        label: "Kaks ratio",
        valueType: {
          type: "number",
        },
      },
      {
        id: "selectionBand",
        label: "Selection band",
        valueType: {
          type: "string",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
