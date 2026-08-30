import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { dna, reverseDNA } from "../shared.js";

export type Input = Readonly<{
  readonly trinucleotide: string;
  readonly alternateBase: string;
}>;
export type Output = Readonly<{
  readonly canonicalContext: string;
  readonly canonicalChange: string;
  readonly channelIndex: number;
}>;
// https://cancer.sanger.ac.uk/signatures/sbs/sbs96/
export const calculate = (input: Input): Output => {
  validateInput(input);
  const context = dna(input.trinucleotide),
    alternate = dna(input.alternateBase);
  if (
    context.length !== 3 ||
    alternate.length !== 1 ||
    context[1] === alternate
  )
    simpleError(
      "alternateBase",
      "A trinucleotide and a different single alternate base required.",
    );
  const reverse = !"CT".includes(context[1]),
    canonicalContext = reverse ? reverseDNA(context) : context,
    alt = reverse ? reverseDNA(alternate) : alternate,
    canonicalChange = `${canonicalContext[1]}>${alt}`,
    types = ["C>A", "C>G", "C>T", "T>A", "T>C", "T>G"],
    bases = "ACGT";
  return {
    canonicalContext,
    canonicalChange,
    channelIndex:
      types.indexOf(canonicalChange) * 16 +
      bases.indexOf(canonicalContext[0]) * 4 +
      bases.indexOf(canonicalContext[2]),
  };
};
export const exampleInput = {
  trinucleotide: "ACA",
  alternateBase: "T",
} satisfies Input;
export const exampleOutput = {
  canonicalContext: "ACA",
  canonicalChange: "C>T",
  channelIndex: 32,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trinucleotide: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]{3}\\s*$",
    },
    alternateBase: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]\\s*$",
    },
  },
  required: ["trinucleotide", "alternateBase"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonicalContext: {
      type: "string",
      minLength: 3,
      maxLength: 3,
      pattern: "^[ACGT]{3}(?![\\s\\S])",
    },
    canonicalChange: {
      type: "string",
      enum: ["C>A", "C>G", "C>T", "T>A", "T>C", "T>G"],
    },
    channelIndex: {
      type: "integer",
      minimum: 0,
      maximum: 95,
      description: "Zero-based substitution-major index: C>A, C>G, C>T, T>A, T>C, T>G; then 5-prime and 3-prime bases in A,C,G,T order.",
    },
  },
  required: ["canonicalContext", "canonicalChange", "channelIndex"],
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
  id: "genomics/mutation-context-96-index",
  title: "Mutation Context 96 Index",
  description: "Index 96 pyrimidine-oriented mutation channels in substitution-major then A/C/G/T flank order.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "trinucleotide",
        label: "Trinucleotide",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "alternateBase",
        label: "Alternate base",
        required: true,
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "canonicalContext",
        label: "Canonical context",
        valueType: {
          type: "string",
        },
      },
      {
        id: "canonicalChange",
        label: "Canonical change",
        valueType: {
          type: "string",
        },
      },
      {
        id: "channelIndex",
        label: "Channel index",
        description: "Zero-based substitution-major index: C>A, C>G, C>T, T>A, T>C, T>G; then 5-prime and 3-prime bases in A,C,G,T order.",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
