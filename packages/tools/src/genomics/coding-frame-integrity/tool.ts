import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly requireStartCodon: boolean;
  readonly requireTerminalStop: boolean;
}>;
export type Output = Readonly<{
  readonly frameDivisible: boolean;
  readonly internalStopCount: number;
  readonly intact: boolean;
}>;
// https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi (standard genetic code)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const s = dna(input.sequence),
    frameDivisible = s.length % 3 === 0,
    stop = (v: string) => ["TAA", "TAG", "TGA"].includes(v);
  let internalStopCount = 0;
  for (let i = 0; i + 3 < s.length; i += 3)
    if (stop(s.slice(i, i + 3))) internalStopCount++;
  return {
    frameDivisible,
    internalStopCount,
    intact:
      s.length >= (stop(s.slice(-3)) ? 6 : 3) &&
      frameDivisible &&
      internalStopCount === 0 &&
      (!input.requireStartCodon || s.startsWith("ATG")) &&
      (!input.requireTerminalStop || stop(s.slice(-3))),
  };
};
export const exampleInput = {
  sequence: "ATGAAATAA",
  requireStartCodon: true,
  requireTerminalStop: true,
} satisfies Input;
export const exampleOutput = {
  frameDivisible: true,
  internalStopCount: 0,
  intact: true,
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
    requireStartCodon: {
      type: "boolean",
    },
    requireTerminalStop: {
      type: "boolean",
    },
  },
  required: ["sequence", "requireStartCodon", "requireTerminalStop"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frameDivisible: {
      type: "boolean",
    },
    internalStopCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    intact: {
      type: "boolean",
    },
  },
  required: ["frameDivisible", "internalStopCount", "intact"],
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
  id: "genomics/coding-frame-integrity",
  title: "Coding Frame Integrity",
  description: "Screen an in-frame canonical DNA coding sequence using the standard ATG start and TAA/TAG/TGA stops, with chosen start/terminal-stop requirements.",
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
        id: "requireStartCodon",
        label: "Require start codon",
        required: true,
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "requireTerminalStop",
        label: "Require terminal stop",
        required: true,
        valueType: {
          type: "boolean",
        },
      },
    ],
    outputs: [
      {
        id: "frameDivisible",
        label: "Frame divisible",
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "internalStopCount",
        label: "Internal stop count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "intact",
        label: "Intact",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
