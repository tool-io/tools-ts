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
  readonly repeatMotif: string;
}>;
export type Output = Readonly<{
  readonly leftTerminalCopies: number;
  readonly rightTerminalCopies: number;
  readonly terminalRepeatBases: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  const motif = input.repeatMotif.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(motif))
    simpleError("repeatMotif", "Canonical A/C/G/T DNA is required.");
  let leftTerminalCopies = 0,
    rightTerminalCopies = 0;
  while (s.startsWith(motif, leftTerminalCopies * motif.length))
    leftTerminalCopies++;
  while (
    (rightTerminalCopies + 1) * motif.length <= s.length &&
    s.slice(
      s.length - (rightTerminalCopies + 1) * motif.length,
      s.length - rightTerminalCopies * motif.length,
    ) === motif
  )
    rightTerminalCopies++;
  return {
    leftTerminalCopies,
    rightTerminalCopies,
    terminalRepeatBases: Math.min(
      s.length,
      (leftTerminalCopies + rightTerminalCopies) * motif.length,
    ),
  };
};
export const exampleInput = {
  sequence: "TTAGGGTTAGGGACGTTTAGGG",
  repeatMotif: "TTAGGG",
} satisfies Input;
export const exampleOutput = {
  leftTerminalCopies: 2,
  rightTerminalCopies: 1,
  terminalRepeatBases: 18,
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
    repeatMotif: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
      description: "Exact motif to match at both ends of the supplied strand; no reverse-complement inference.",
    },
  },
  required: ["sequence", "repeatMotif"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftTerminalCopies: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    rightTerminalCopies: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    terminalRepeatBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Bases in the union of terminal motif runs; overlaps are counted once.",
    },
  },
  required: ["leftTerminalCopies", "rightTerminalCopies", "terminalRepeatBases"],
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
  id: "genomics/terminal-telomere-repeats",
  title: "Terminal Telomere Repeats",
  description: "Count exact copies of the supplied motif at both sequence ends and report their combined span without counting overlaps twice.",
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
        id: "repeatMotif",
        label: "Repeat motif",
        required: true,
        description: "Exact motif to match at both ends of the supplied strand; no reverse-complement inference.",
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "leftTerminalCopies",
        label: "Left terminal copies",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "rightTerminalCopies",
        label: "Right terminal copies",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "terminalRepeatBases",
        label: "Terminal repeat bases",
        description: "Bases in the union of terminal motif runs; overlaps are counted once.",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
