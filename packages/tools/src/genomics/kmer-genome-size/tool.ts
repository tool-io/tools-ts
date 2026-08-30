import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, positive } from "../shared.js";

export type Input = Readonly<{
  readonly kmerOccurrences: number;
  readonly lowCountErrorOccurrences: number;
  readonly mainPeakDepth: number;
}>;
export type Output = Readonly<{
  readonly retainedOccurrences: number;
  readonly estimatedGenomeBases: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.kmerOccurrences, "kmerOccurrences");
  count(input.lowCountErrorOccurrences, "lowCountErrorOccurrences");
  positive(input.mainPeakDepth, "mainPeakDepth");
  if (input.lowCountErrorOccurrences > input.kmerOccurrences)
    simpleError(
      "lowCountErrorOccurrences",
      "Error occurrences cannot exceed all k-mer occurrences.",
    );
  const retainedOccurrences =
    (input.kmerOccurrences - input.lowCountErrorOccurrences) || 0;
  const estimatedGenomeBases = retainedOccurrences / input.mainPeakDepth;
  if (!Number.isFinite(estimatedGenomeBases))
    simpleError("mainPeakDepth", "Estimated genome size exceeds the finite number range.", "result_overflow");
  return {
    retainedOccurrences,
    estimatedGenomeBases,
  };
};
export const exampleInput = {
  kmerOccurrences: 1000000,
  lowCountErrorOccurrences: 100000,
  mainPeakDepth: 30,
} satisfies Input;
export const exampleOutput = {
  retainedOccurrences: 900000,
  estimatedGenomeBases: 30000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kmerOccurrences: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    lowCountErrorOccurrences: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    mainPeakDepth: {
      type: "number",
      exclusiveMinimum: 0,
    },
  },
  required: ["kmerOccurrences", "lowCountErrorOccurrences", "mainPeakDepth"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedOccurrences: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    estimatedGenomeBases: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["retainedOccurrences", "estimatedGenomeBases"],
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
  id: "genomics/kmer-genome-size",
  title: "K-mer Genome Size",
  description: "Estimate genome size from retained k-mer occurrences divided by the caller-selected single-copy peak.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "kmerOccurrences",
        label: "Kmer occurrences",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "lowCountErrorOccurrences",
        label: "Low count error occurrences",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "mainPeakDepth",
        label: "Main peak depth",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "retainedOccurrences",
        label: "Retained occurrences",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "estimatedGenomeBases",
        label: "Estimated genome bases",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
