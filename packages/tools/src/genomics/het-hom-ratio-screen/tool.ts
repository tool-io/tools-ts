import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly heterozygousCount: number;
  readonly homozygousAlternateCount: number;
  readonly minimumRatio: number;
  readonly maximumRatio: number;
}>;
export type Output = Readonly<{
  readonly hetHomRatio: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.heterozygousCount, "heterozygousCount");
  count(input.homozygousAlternateCount, "homozygousAlternateCount", 1);
  if (input.minimumRatio < 0 || input.maximumRatio < input.minimumRatio)
    simpleError("maximumRatio", "Ordered nonnegative ratio range required.");
  const hetHomRatio = input.heterozygousCount / input.homozygousAlternateCount;
  return {
    hetHomRatio,
    withinRange:
      hetHomRatio >= input.minimumRatio && hetHomRatio <= input.maximumRatio,
  };
};
export const exampleInput = {
  heterozygousCount: 150,
  homozygousAlternateCount: 100,
  minimumRatio: 1.4,
  maximumRatio: 1.6,
} satisfies Input;
export const exampleOutput = {
  hetHomRatio: 1.5,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heterozygousCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    homozygousAlternateCount: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    minimumRatio: {
      type: "number",
      minimum: 0,
    },
    maximumRatio: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["heterozygousCount", "homozygousAlternateCount", "minimumRatio", "maximumRatio"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hetHomRatio: {
      type: "number",
      minimum: 0,
    },
    withinRange: {
      type: "boolean",
    },
  },
  required: ["hetHomRatio", "withinRange"],
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
  id: "genomics/het-hom-ratio-screen",
  title: "Het Hom Ratio Screen",
  description: "Screen heterozygous/homozygous-alternate variant ratio against caller-supplied cohort expectations.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "heterozygousCount",
        label: "Heterozygous count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "homozygousAlternateCount",
        label: "Homozygous alternate count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "minimumRatio",
        label: "Minimum ratio",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumRatio",
        label: "Maximum ratio",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "hetHomRatio",
        label: "Het hom ratio",
        valueType: {
          type: "number",
        },
      },
      {
        id: "withinRange",
        label: "Within range",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
