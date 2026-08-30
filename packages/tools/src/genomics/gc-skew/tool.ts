import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, positive, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly neutralTolerance: number;
}>;
export type Output = Readonly<{
  readonly gCount: number;
  readonly cCount: number;
  readonly gcSkew: number;
  readonly bias: string;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  fraction(input.neutralTolerance, "neutralTolerance");
  const gCount = [...s].filter((v) => v === "G").length,
    cCount = [...s].filter((v) => v === "C").length;
  positive(gCount + cCount, "sequence");
  const gcSkew = (gCount - cCount) / (gCount + cCount);
  return {
    gCount,
    cCount,
    gcSkew,
    bias:
      gcSkew > input.neutralTolerance
        ? "G-enriched"
        : gcSkew < -input.neutralTolerance
          ? "C-enriched"
          : "near-balanced",
  };
};
export const exampleInput = {
  sequence: "GGGC",
  neutralTolerance: 0.1,
} satisfies Input;
export const exampleOutput = {
  gCount: 3,
  cCount: 1,
  gcSkew: 0.5,
  bias: "G-enriched",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
    neutralTolerance: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "Absolute skew at or below this fraction is near-balanced.",
    },
  },
  required: ["sequence", "neutralTolerance"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    cCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    gcSkew: {
      type: "number",
      minimum: -1,
      maximum: 1,
    },
    bias: {
      type: "string",
      enum: ["G-enriched", "C-enriched", "near-balanced"],
    },
  },
  required: ["gCount", "cCount", "gcSkew", "bias"],
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
  id: "genomics/gc-skew",
  title: "GC Skew",
  description: "Calculate GC skew and compositional bias without inferring replication strand from skew alone.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sequence",
        label: "Sequence",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "neutralTolerance",
        label: "Neutral tolerance",
        required: true,
        description: "Absolute skew at or below this fraction is near-balanced.",
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "gCount",
        label: "G count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "cCount",
        label: "C count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "gcSkew",
        label: "GC skew",
        valueType: {
          type: "number",
        },
      },
      {
        id: "bias",
        label: "Bias",
        valueType: {
          type: "string",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
