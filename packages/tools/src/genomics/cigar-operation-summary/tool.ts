import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type CigarToken = Readonly<{ length: number; op: string }>;

// SAM v1 section 1.4: H is terminal; S has only H between it and a terminus.
// https://samtools.github.io/hts-specs/SAMv1.pdf
export const parseCigar = (cigar: string): readonly CigarToken[] => {
  if (!/^(?:[1-9][0-9]*[MIDNSHP=X])+(?![\s\S])/.test(cigar))
    simpleError("cigar", "A complete CIGAR with positive operation lengths is required.", "invalid_cigar");
  const tokens: CigarToken[] = [];
  for (const match of cigar.matchAll(/([0-9]+)([MIDNSHP=X])/g)) {
    if (tokens.length === 100000)
      simpleError("cigar", "CIGAR is limited to 100000 operations.", "resource_limit_exceeded");
    tokens.push({ length: count(Number(match[1]), "cigar", 1), op: match[2] });
  }
  const last = tokens.length - 1;
  const firstSoftPosition = tokens[0].op === "H" ? 1 : 0;
  const lastSoftPosition = tokens[last].op === "H" ? last - 1 : last;
  tokens.forEach((token, i) => {
    if ((token.op === "H" && i !== 0 && i !== last) ||
        (token.op === "S" && i !== firstSoftPosition && i !== lastSoftPosition))
      simpleError("cigar", "Clipping operations must be at CIGAR termini.", "invalid_clipping");
  });
  return tokens;
};

export const addCigarBases = (sum: number, length: number, field = "cigar"): number => {
  if (length > Number.MAX_SAFE_INTEGER - sum)
    simpleError(field, "CIGAR lengths or coordinates exceed the safe integer range.",
      field === "cigar" ? "count_overflow" : "coordinate_overflow");
  return sum + length;
};

export type Input = Readonly<{
  readonly cigar: string;
}>;
export type Output = Readonly<{
  readonly operations: readonly string[];
  readonly operationBases: readonly number[];
  readonly queryConsumed: number;
  readonly referenceConsumed: number;
}>;
export const calculate = (input: Input): Output => {
  const totals = new Map<string, number>();
  let queryConsumed = 0;
  let referenceConsumed = 0;
  for (const token of parseCigar(input.cigar)) {
    totals.set(token.op, addCigarBases(totals.get(token.op) ?? 0, token.length));
    if ("MIS=X".includes(token.op)) queryConsumed = addCigarBases(queryConsumed, token.length);
    if ("MDN=X".includes(token.op)) referenceConsumed = addCigarBases(referenceConsumed, token.length);
  }
  const entries = [...totals.entries()];
  return {
    operations: entries.map(([operation]) => operation),
    operationBases: entries.map(([, bases]) => bases),
    queryConsumed,
    referenceConsumed,
  };
};
export const exampleInput = { cigar: "5S10M2I3D4N1H" } satisfies Input;
export const exampleOutput = {
  operations: ["S", "M", "I", "D", "N", "H"],
  operationBases: [5, 10, 2, 3, 4, 1],
  queryConsumed: 17,
  referenceConsumed: 17,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cigar: {
      type: "string",
      maxLength: 1000000,
      minLength: 2,
      pattern: "^(?:[1-9][0-9]*[MIDNSHP=X])+(?![\\s\\S])",
      description: "Explicit CIGAR with positive lengths and terminal SAM clipping; * is unavailable, not an alignment.",
    },
  },
  required: ["cigar"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operations: {
      type: "array",
      items: {
        type: "string",
        enum: ["M", "I", "D", "N", "S", "H", "P", "=", "X"],
      },
      minItems: 1,
      maxItems: 9,
    },
    operationBases: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 9,
    },
    queryConsumed: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    referenceConsumed: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["operations", "operationBases", "queryConsumed", "referenceConsumed"],
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
  id: "genomics/cigar-operation-summary",
  title: "CIGAR Operation Summary",
  description: "Summarize CIGAR operations and distinguish query-consuming and reference-consuming bases.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cigar",
        label: "CIGAR",
        required: true,
        description: "Explicit CIGAR with positive lengths and terminal SAM clipping; * is unavailable, not an alignment.",
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "operations",
        label: "Operations",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "operationBases",
        label: "Operation bases",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "queryConsumed",
        label: "Query consumed",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "referenceConsumed",
        label: "Reference consumed",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
