import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly log2Ratios: readonly number[];
  readonly normalPloidy: number;
  readonly purityFraction: number;
}>;
export type Output = Readonly<{
  readonly observedCopyRatios: readonly number[];
  readonly tumorCopyNumbers: readonly number[];
}>;
// https://cnvkit.readthedocs.io/en/stable/calling.html (supplied baseline/purity model, without ploidy inference)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const observedCopyRatios: number[] = [], tumorCopyNumbers: number[] = [];
  for (const log2 of input.log2Ratios) {
    const ratio = 2 ** log2;
    if (!Number.isFinite(ratio))
      simpleError("log2Ratios", "Observed ratio exceeds the finite number range.", "result_overflow");
    let copies: number;
    if (input.purityFraction === 1) {
      copies = input.normalPloidy * ratio;
      // A representable copy number can survive underflow of the intermediate ratio.
      if (ratio < 2 ** -1022) copies = 2 ** (Math.log2(input.normalPloidy) + log2);
    } else {
      // expm1 retains tiny deviations around ratio 1 before division by purity.
      const deviation = Math.abs(log2) < 0.5 ? Math.expm1(log2 * Math.LN2) : ratio - 1;
      // At subnormal exponents, divide first so purity can amplify the deviation.
      const relativeDeviation = Math.abs(log2) < 2 ** -1022
        ? (log2 / input.purityFraction) * Math.LN2
        : deviation / input.purityFraction;
      const factor = 1 + relativeDeviation;
      if (factor < 0)
        simpleError("log2Ratios", "Ratios are incompatible with supplied purity and baseline ploidy.");
      copies = input.normalPloidy * factor;
      if (!Number.isFinite(factor) && deviation > 0) {
        const scaledPloidy = input.normalPloidy / input.purityFraction;
        const gain = Number.isFinite(scaledPloidy)
          ? scaledPloidy * deviation
          : (input.normalPloidy * deviation) / input.purityFraction;
        copies = input.normalPloidy + gain;
      }
    }
    if (!Number.isFinite(copies))
      simpleError("log2Ratios", "Tumor copy number exceeds the finite number range.", "result_overflow");
    observedCopyRatios.push(Math.max(0, ratio));
    tumorCopyNumbers.push(Math.max(0, copies));
  }
  return { observedCopyRatios, tumorCopyNumbers };
};
export const exampleInput = {
  log2Ratios: [-1, 0, 1],
  normalPloidy: 2,
  purityFraction: 1,
} satisfies Input;
export const exampleOutput = {
  observedCopyRatios: [0.5, 1, 2],
  tumorCopyNumbers: [1, 2, 4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    log2Ratios: {
      type: "array",
      items: {
        type: "number",
      },
      minItems: 0,
      maxItems: 100000,
      description: "Log2 sample-to-normal ratios in the simple admixture model R = purity * tumorCopies / normalPloidy + (1 - purity).",
    },
    normalPloidy: {
      type: "number",
      exclusiveMinimum: 0,
    },
    purityFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
  },
  required: ["log2Ratios", "normalPloidy", "purityFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCopyRatios: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 0,
      maxItems: 100000,
    },
    tumorCopyNumbers: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["observedCopyRatios", "tumorCopyNumbers"],
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
  id: "genomics/tumor-normal-copy-ratio",
  title: "Tumor Normal Copy Ratio",
  description: "Interpret log2 tumor/normal ratios with an explicit normal-cell admixture and baseline ploidy model.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "log2Ratios",
        label: "Log 2 ratios",
        required: true,
        description: "Log2 sample-to-normal ratios in the simple admixture model R = purity * tumorCopies / normalPloidy + (1 - purity).",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "normalPloidy",
        label: "Normal ploidy",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "purityFraction",
        label: "Purity fraction",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "observedCopyRatios",
        label: "Observed copy ratios",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "tumorCopyNumbers",
        label: "Tumor copy numbers",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
