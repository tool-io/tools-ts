import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly inclusionReads: number;
  readonly skippingReads: number;
  readonly inclusionEffectiveLength: number;
  readonly skippingEffectiveLength: number;
}>;
export type Output = Readonly<{
  readonly inclusionDensity: number;
  readonly skippingDensity: number;
  readonly psiPercent: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const inclusionDensity = input.inclusionReads / input.inclusionEffectiveLength;
  const skippingDensity = input.skippingReads / input.skippingEffectiveLength;
  if (!Number.isFinite(inclusionDensity))
    simpleError("inclusionEffectiveLength", "Inclusion density exceeds the finite number range.", "result_overflow");
  if (!Number.isFinite(skippingDensity))
    simpleError("skippingEffectiveLength", "Skipping density exceeds the finite number range.", "result_overflow");
  const scale = Math.max(inclusionDensity, skippingDensity);
  positive(scale, "inclusionReads");
  const total = inclusionDensity + skippingDensity;
  const numerator = 100 * inclusionDensity;
  const psiPercent = Number.isFinite(total) && Number.isFinite(numerator) && total >= 2 ** -1022 ? numerator / total : 100 * (inclusionDensity / scale) / (inclusionDensity / scale + skippingDensity / scale);
  return { inclusionDensity, skippingDensity, psiPercent };
};
export const exampleInput = {
  inclusionReads: 80,
  skippingReads: 20,
  inclusionEffectiveLength: 200,
  skippingEffectiveLength: 100,
} satisfies Input;
export const exampleOutput = {
  inclusionDensity: 0.4,
  skippingDensity: 0.2,
  psiPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusionReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    skippingReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    inclusionEffectiveLength: {
      type: "number",
      exclusiveMinimum: 0,
    },
    skippingEffectiveLength: {
      type: "number",
      exclusiveMinimum: 0,
    },
  },
  required: ["inclusionReads", "skippingReads", "inclusionEffectiveLength", "skippingEffectiveLength"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusionDensity: {
      type: "number",
      minimum: 0,
    },
    skippingDensity: {
      type: "number",
      minimum: 0,
    },
    psiPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["inclusionDensity", "skippingDensity", "psiPercent"],
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
  id: "genomics/length-normalized-psi",
  title: "Length Normalized PSI",
  description: "Quantify PSI from inclusion and skipping counts normalized by their effective lengths.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "inclusionReads",
        label: "Inclusion reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "skippingReads",
        label: "Skipping reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "inclusionEffectiveLength",
        label: "Inclusion effective length",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "skippingEffectiveLength",
        label: "Skipping effective length",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "inclusionDensity",
        label: "Inclusion density",
        valueType: {
          type: "number",
        },
      },
      {
        id: "skippingDensity",
        label: "Skipping density",
        valueType: {
          type: "number",
        },
      },
      {
        id: "psiPercent",
        label: "Psi percent",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
