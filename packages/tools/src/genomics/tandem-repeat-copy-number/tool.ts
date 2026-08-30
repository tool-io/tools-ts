import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly motif: string;
}>;
export type Output = Readonly<{
  readonly longestCopyNumber: number;
  readonly repeatStart: number;
  readonly repeatEnd: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  const motif = input.motif.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(motif))
    simpleError("motif", "Canonical A/C/G/T DNA is required.");
  if (motif.length > s.length)
    return { longestCopyNumber: 0, repeatStart: -1, repeatEnd: -1 };
  if (s.length * motif.length > 10000000)
    simpleError("motif", "Repeat comparison exceeds the operation budget.");
  const runs = new Uint32Array(s.length + 1);
  let longestCopyNumber = 0,
    repeatStart = -1;
  for (let i = s.length - motif.length; i >= 0; i--) {
    if (s.startsWith(motif, i)) {
      runs[i] = 1 + runs[i + motif.length];
      if (runs[i] >= longestCopyNumber) {
        longestCopyNumber = runs[i];
        repeatStart = i;
      }
    }
  }
  return {
    longestCopyNumber,
    repeatStart,
    repeatEnd:
      repeatStart < 0 ? -1 : repeatStart + longestCopyNumber * motif.length,
  };
};
export const exampleInput = {
  sequence: "ATATATGCATAT",
  motif: "AT",
} satisfies Input;
export const exampleOutput = {
  longestCopyNumber: 3,
  repeatStart: 0,
  repeatEnd: 6,
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
    motif: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
  },
  required: ["sequence", "motif"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    longestCopyNumber: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    repeatStart: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
      description: "Zero-based inclusive start; -1 if no full motif occurs. Ties choose the earliest start.",
    },
    repeatEnd: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
      description: "Zero-based exclusive end; -1 if no full motif occurs.",
    },
  },
  required: ["longestCopyNumber", "repeatStart", "repeatEnd"],
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
  id: "genomics/tandem-repeat-copy-number",
  title: "Tandem Repeat Copy Number",
  description: "Find the longest exact DNA motif run at zero-based half-open positions, choosing the earliest tie.",
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
        id: "motif",
        label: "Motif",
        required: true,
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "longestCopyNumber",
        label: "Longest copy number",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "repeatStart",
        label: "Repeat start",
        description: "Zero-based inclusive start; -1 if no full motif occurs. Ties choose the earliest start.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "repeatEnd",
        label: "Repeat end",
        description: "Zero-based exclusive end; -1 if no full motif occurs.",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
