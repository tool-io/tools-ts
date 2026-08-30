import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly aCount: number;
  readonly tCount: number;
  readonly atSkew: number;
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence),
    aCount = [...s].filter((v) => v === "A").length,
    tCount = [...s].filter((v) => v === "T").length;
  positive(aCount + tCount, "sequence");
  return { aCount, tCount, atSkew: (aCount - tCount) / (aCount + tCount) };
};
export const exampleInput = { sequence: "AAAT" } satisfies Input;
export const exampleOutput = {
  aCount: 3,
  tCount: 1,
  atSkew: 0.5,
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
  },
  required: ["sequence"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    tCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    atSkew: {
      type: "number",
      minimum: -1,
      maximum: 1,
    },
  },
  required: ["aCount", "tCount", "atSkew"],
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
  id: "genomics/at-skew",
  title: "AT Skew",
  description: "Calculate AT skew as (A−T)/(A+T) from a canonical DNA sequence.",
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
    ],
    outputs: [
      {
        id: "aCount",
        label: "A count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "tCount",
        label: "T count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "atSkew",
        label: "AT skew",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
