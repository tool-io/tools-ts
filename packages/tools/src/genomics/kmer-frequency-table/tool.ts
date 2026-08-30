import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, dna, reverseDNA } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly k: number;
  readonly canonicalReverseComplement: boolean;
}>;
export type Output = Readonly<{
  readonly kmers: readonly string[];
  readonly occurrenceCounts: readonly number[];
  readonly totalWindows: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  count(input.k, "k", 1);
  if (input.k > s.length) simpleError("k", "K cannot exceed sequence length.");
  if (s.length - input.k + 1 > 100000)
    simpleError("sequence", "K-mer tally is limited to 100000 windows.");
  if ((s.length - input.k + 1) * input.k > 10000000)
    simpleError("k", "K-mer comparison exceeds the operation budget.");
  const tally = new Map<string, number>();
  for (let i = 0; i + input.k <= s.length; i++) {
    const value = s.slice(i, i + input.k),
      reverse = input.canonicalReverseComplement ? reverseDNA(value) : value,
      key = value < reverse ? value : reverse;
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  const entries = [...tally.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  return {
    kmers: entries.map(([kmer]) => kmer),
    occurrenceCounts: entries.map(([, occurrences]) => occurrences),
    totalWindows: s.length - input.k + 1,
  };
};
export const exampleInput = {
  sequence: "ACAC",
  k: 2,
  canonicalReverseComplement: false,
} satisfies Input;
export const exampleOutput = {
  kmers: ["AC", "CA"],
  occurrenceCounts: [2, 1],
  totalWindows: 3,
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
    k: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    canonicalReverseComplement: {
      type: "boolean",
    },
  },
  required: ["sequence", "k", "canonicalReverseComplement"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    kmers: {
      type: "array",
      items: {
        type: "string",
        maxLength: 1000000,
      },
      minItems: 1,
      maxItems: 100000,
    },
    occurrenceCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    totalWindows: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["kmers", "occurrenceCounts", "totalWindows"],
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
  id: "genomics/kmer-frequency-table",
  title: "K-mer Frequency Table",
  description: "Tabulate overlapping k-mer frequencies with optional reverse-complement canonicalization.",
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
        id: "k",
        label: "K",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "canonicalReverseComplement",
        label: "Canonical reverse complement",
        required: true,
        valueType: {
          type: "boolean",
        },
      },
    ],
    outputs: [
      {
        id: "kmers",
        label: "K-mers",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "occurrenceCounts",
        label: "Occurrence counts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "totalWindows",
        label: "Total windows",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
