import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly fasta: string;
  readonly expectedWidth: number;
}>;
export type Output = Readonly<{
  readonly recordCount: number;
  readonly nonterminalWidthViolations: number;
  readonly terminalWidthViolations: number;
  readonly consistent: boolean;
}>;
// https://www.ncbi.nlm.nih.gov/genbank/fastaformat/ (wrapping is audited with a caller-supplied width)
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.expectedWidth, "expectedWidth", 1);
  const records: string[][] = [];
  for (const line of input.fasta.split(/\r?\n/)) {
    if (!line.trim()) continue;
    if (line.startsWith(">")) {
      if (!line.slice(1).trim())
        simpleError("fasta", "Nonempty FASTA identifiers required.");
      records.push([]);
    } else {
      if (!records.length || !/^[A-Za-z*.-]+$/.test(line))
        simpleError("fasta", "Sequence lines must follow a FASTA header.");
      records[records.length - 1].push(line);
    }
  }
  if (!records.length || records.some((row) => row.length === 0))
    simpleError("fasta", "Each FASTA record requires sequence lines.");
  let nonterminalWidthViolations = 0,
    terminalWidthViolations = 0;
  for (const record of records) {
    nonterminalWidthViolations += record
      .slice(0, -1)
      .filter((v) => v.length !== input.expectedWidth).length;
    if (record[record.length - 1].length > input.expectedWidth)
      terminalWidthViolations++;
  }
  return {
    recordCount: records.length,
    nonterminalWidthViolations,
    terminalWidthViolations,
    consistent: nonterminalWidthViolations + terminalWidthViolations === 0,
  };
};
export const exampleInput = {
  fasta: ">a\nACGT\nAC\n>b\nTGCA\n",
  expectedWidth: 4,
} satisfies Input;
export const exampleOutput = {
  recordCount: 2,
  nonterminalWidthViolations: 0,
  terminalWidthViolations: 0,
  consistent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fasta: {
      type: "string",
      maxLength: 1000000,
      minLength: 1,
    },
    expectedWidth: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["fasta", "expectedWidth"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCount: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    nonterminalWidthViolations: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    terminalWidthViolations: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    consistent: {
      type: "boolean",
    },
  },
  required: ["recordCount", "nonterminalWidthViolations", "terminalWidthViolations", "consistent"],
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
  id: "genomics/fasta-line-width-audit",
  title: "FASTA Line Width Audit",
  description: "Audit wrapping of nucleotide or protein FASTA records at a caller-supplied width, allowing a shorter final sequence line.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "fasta",
        label: "Fasta",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "expectedWidth",
        label: "Expected width",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "recordCount",
        label: "Record count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "nonterminalWidthViolations",
        label: "Nonterminal width violations",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "terminalWidthViolations",
        label: "Terminal width violations",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "consistent",
        label: "Consistent",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
