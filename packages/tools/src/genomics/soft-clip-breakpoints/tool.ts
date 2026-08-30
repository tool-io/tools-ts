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
import { parseCigar, addCigarBases } from "../cigar-operation-summary/tool.js";

export type Input = Readonly<{
  readonly cigar: string;
  readonly alignmentStart: number;
  readonly minimumClipLength: number;
}>;
export type Output = Readonly<{
  readonly leftClipLength: number;
  readonly rightClipLength: number;
  readonly breakpointHints: readonly number[];
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (section 1.4, CIGAR)
export const calculate = (input: Input): Output => {
  const tokens = parseCigar(input.cigar);
  count(input.alignmentStart, "alignmentStart");
  count(input.minimumClipLength, "minimumClipLength", 1);
  const alignmentStart = input.alignmentStart === 0 ? 0 : input.alignmentStart;
  const aligned = tokens.filter((v) => v.op !== "H"),
    leftClipLength = aligned[0]?.op === "S" ? aligned[0].length : 0,
    rightClipLength =
      aligned[aligned.length - 1]?.op === "S"
        ? aligned[aligned.length - 1].length
        : 0,
    referenceSpan = tokens
      .filter((v) => "MDN=X".includes(v.op))
      .reduce((a, b) => addCigarBases(a, b.length), 0),
    breakpointHints: number[] = [];
  if (referenceSpan === 0)
    simpleError("cigar", "A reference-consuming alignment is required for breakpoint hints.", "alignment_required");
  const alignmentEnd = addCigarBases(alignmentStart, referenceSpan, "alignmentStart");
  if (leftClipLength >= input.minimumClipLength)
    breakpointHints.push(alignmentStart);
  if (rightClipLength >= input.minimumClipLength)
    breakpointHints.push(alignmentEnd);
  return { leftClipLength, rightClipLength, breakpointHints };
};
export const exampleInput = {
  cigar: "5S10M3S",
  alignmentStart: 100,
  minimumClipLength: 4,
} satisfies Input;
export const exampleOutput = {
  leftClipLength: 5,
  rightClipLength: 3,
  breakpointHints: [100],
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
    minimumClipLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["cigar", "alignmentStart", "minimumClipLength"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftClipLength: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    rightClipLength: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    breakpointHints: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 2,
    },
  },
  required: ["leftClipLength", "rightClipLength", "breakpointHints"],
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
  id: "genomics/soft-clip-breakpoints",
  title: "Soft Clip Breakpoints",
  description: "Generate zero-based reference-boundary hints from terminal soft clips and aligned CIGAR span.",
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
      {
        id: "minimumClipLength",
        label: "Minimum clip length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "leftClipLength",
        label: "Left clip length",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "rightClipLength",
        label: "Right clip length",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "breakpointHints",
        label: "Breakpoint hints",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
