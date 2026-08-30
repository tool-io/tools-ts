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

export type Input = Readonly<{
  readonly readCount: number;
  readonly readLength: number;
  readonly genomeBases: number;
}>;
export type Output = Readonly<{
  readonly sequencedBases: number;
  readonly foldCoverage: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.readCount, "readCount");
  count(input.readLength, "readLength", 1);
  count(input.genomeBases, "genomeBases", 1);
  const sequencedBases = input.readCount === 0 ? 0 : input.readCount * input.readLength;
  if (!Number.isSafeInteger(sequencedBases))
    simpleError(
      "readCount",
      "Sequenced base count exceeds safe integer range.",
      "count_overflow",
    );
  return { sequencedBases, foldCoverage: sequencedBases / input.genomeBases };
};
export const exampleInput = {
  readCount: 100,
  readLength: 100,
  genomeBases: 1000,
} satisfies Input;
export const exampleOutput = {
  sequencedBases: 10000,
  foldCoverage: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Individual reads, not read pairs.",
    },
    readLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    genomeBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["readCount", "readLength", "genomeBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequencedBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    foldCoverage: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["sequencedBases", "foldCoverage"],
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
  id: "genomics/sequencing-fold-depth",
  title: "Sequencing Fold Depth",
  description: "Compute theoretical sequencing depth from individual read count, read length, and genome size.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "readCount",
        label: "Read count",
        required: true,
        description: "Individual reads, not read pairs.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "readLength",
        label: "Read length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "genomeBases",
        label: "Genome bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "sequencedBases",
        label: "Sequenced bases",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "foldCoverage",
        label: "Fold coverage",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
