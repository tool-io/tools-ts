import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";
import { parseCigar, addCigarBases } from "../cigar-operation-summary/tool.js";

export type Input = Readonly<{
  readonly cigar: string;
  readonly alignmentStart: number;
}>;
export type Output = Readonly<{
  readonly junctionStarts: readonly number[];
  readonly junctionEnds: readonly number[];
  readonly junctionCount: number;
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (section 1.4, CIGAR)
export const calculate = (input: Input): Output => {
  const tokens = parseCigar(input.cigar);
  count(input.alignmentStart, "alignmentStart");
  let position = input.alignmentStart === 0 ? 0 : input.alignmentStart;
  const junctionStarts: number[] = [],
    junctionEnds: number[] = [];
  for (const token of tokens) {
    const next = "MDN=X".includes(token.op)
      ? addCigarBases(position, token.length, "alignmentStart")
      : position;
    if (token.op === "N") {
      junctionStarts.push(position);
      junctionEnds.push(next);
    }
    position = next;
  }
  return { junctionStarts, junctionEnds, junctionCount: junctionStarts.length };
};
export const exampleInput = {
  cigar: "10M20N5M",
  alignmentStart: 100,
} satisfies Input;
export const exampleOutput = {
  junctionStarts: [110],
  junctionEnds: [130],
  junctionCount: 1,
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
    },
    alignmentStart: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Zero-based reference start; subtract one from a mapped SAM POS.",
    },
  },
  required: ["cigar", "alignmentStart"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    junctionStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    junctionEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    junctionCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["junctionStarts", "junctionEnds", "junctionCount"],
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
  id: "genomics/cigar-junction-positions",
  title: "CIGAR Junction Positions",
  description: "Extract zero-based half-open reference skip junctions from CIGAR N operations.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "cigar",
        label: "CIGAR",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "alignmentStart",
        label: "Alignment start",
        required: true,
        description: "Zero-based reference start; subtract one from a mapped SAM POS.",
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "junctionStarts",
        label: "Junction starts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "junctionEnds",
        label: "Junction ends",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "junctionCount",
        label: "Junction count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
