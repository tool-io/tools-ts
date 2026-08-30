import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly targetBases: number;
  readonly targetDepth: number;
  readonly readLength: number;
  readonly usablePairFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredReadPairs: number;
  readonly requiredRawReadBases: number;
}>;
// A finite positive binary64 value is an integer significand times a power of two.
// Exact integer division avoids rounding either side of the required pair ceiling.
const binaryParts = (value: number): Readonly<{ significand: bigint; exponent: number }> => {
  const bytes = new DataView(new ArrayBuffer(8));
  bytes.setFloat64(0, value);
  const bits = bytes.getBigUint64(0);
  const exponent = Number((bits >> 52n) & 2047n);
  const fractionBits = bits & ((1n << 52n) - 1n);
  return {
    significand: exponent === 0 ? fractionBits : fractionBits + (1n << 52n),
    exponent: (exponent === 0 ? -1022 : exponent - 1023) - 52,
  };
};
export const calculate = (input: Input): Output => {
  count(input.targetBases, "targetBases", 1);
  positive(input.targetDepth, "targetDepth");
  count(input.readLength, "readLength", 1);
  fraction(input.usablePairFraction, "usablePairFraction");
  positive(input.usablePairFraction, "usablePairFraction");
  const depth = binaryParts(input.targetDepth);
  const usable = binaryParts(input.usablePairFraction);
  let numerator = BigInt(input.targetBases) * depth.significand;
  let denominator = 2n * BigInt(input.readLength) * usable.significand;
  const shift = depth.exponent - usable.exponent;
  if (shift >= 0) numerator <<= BigInt(shift);
  else denominator <<= BigInt(-shift);
  const pairs = (numerator + denominator - 1n) / denominator;
  const rawBases = pairs * 2n * BigInt(input.readLength);
  if (pairs > BigInt(Number.MAX_SAFE_INTEGER) || rawBases > BigInt(Number.MAX_SAFE_INTEGER))
    simpleError("targetDepth", "Required read counts exceed the safe integer range.", "count_overflow");
  return {
    requiredReadPairs: Number(pairs),
    requiredRawReadBases: Number(rawBases),
  };
};
export const exampleInput = {
  targetBases: 1000,
  targetDepth: 20,
  readLength: 100,
  usablePairFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredReadPairs: 200,
  requiredRawReadBases: 40000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    targetDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
    readLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    usablePairFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
      description: "Usable on-target fraction of read pairs in (0, 1].",
    },
  },
  required: ["targetBases", "targetDepth", "readLength", "usablePairFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredReadPairs: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    requiredRawReadBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["requiredReadPairs", "requiredRawReadBases"],
} as const satisfies ToolJsonSchema;

const isInput = (value: unknown): value is Input =>
  matchesToolJsonSchema(value, inputSchema);

export const run = (input: unknown): ToolResult<Output> => {
  if (!isInput(input)) {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return invalidInput([
        { code: "object_required", field: "", message: "Input must be an object." },
      ]);
    const fields = new Map<string, unknown>(Object.entries(input));
    const unknownFields = [...fields.keys()].filter(
      (field) => !Object.hasOwn(inputSchema.properties, field),
    );
    if (unknownFields.length)
      return invalidInput(
        unknownFields.map((field) => ({
          code: "unknown_field",
          field,
          message: `${field} is not a supported input field.`,
        })),
      );
    for (const [field, fieldSchema] of Object.entries(inputSchema.properties))
      if (!matchesToolJsonSchema(fields.get(field), fieldSchema))
        return invalidInput([
          { code: "invalid_field", field, message: `${field} is invalid.` },
        ]);
    return invalidInput([
      { code: "invalid_field", field: "", message: "Input does not match the tool schema." },
    ]);
  }
  try {
    const output = calculate(input);
    if (!matchesToolJsonSchema(output, outputSchema))
      throw new Error("Calculation produced output outside its declared schema.");
    return toolSuccess(output);
  } catch (error) {
    if (!(error instanceof SimpleToolError)) throw error;
    return invalidInput([
      { code: error.code, field: error.field, message: error.message },
    ]);
  }
};

export const tool = defineTool<Input, Output>({
  contractVersion: 1,
  id: "genomics/target-coverage-read-pairs",
  title: "Target Coverage Read Pairs",
  description: "Plan paired reads for target coverage from read length and usable on-target pair fraction.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "targetBases",
        label: "Target bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "targetDepth",
        label: "Target depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "readLength",
        label: "Read length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "usablePairFraction",
        label: "Usable pair fraction",
        required: true,
        description: "Usable on-target fraction of read pairs in (0, 1].",
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "requiredReadPairs",
        label: "Required read pairs",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "requiredRawReadBases",
        label: "Required raw read bases",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
