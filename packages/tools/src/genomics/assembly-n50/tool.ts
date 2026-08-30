import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive, counts, assemblyNx } from "../shared.js";

export type Input = Readonly<{
  readonly contigLengths: readonly number[];
}>;
export type Output = Readonly<{
  readonly n50: number;
  readonly assemblyBases: number;
}>;
// https://quast.sourceforge.net/docs/manual.html#sec3.1
export const calculate = (input: Input): Output => {
  counts(input.contigLengths, "contigLengths");
  const assemblyBases = input.contigLengths.reduce((a, b) => a + b, 0);
  positive(assemblyBases, "contigLengths");
  if (!Number.isSafeInteger(assemblyBases))
    simpleError("contigLengths", "Total assembly length exceeds the safe integer range.", "count_overflow");
  return {
    n50: assemblyNx(input.contigLengths, assemblyBases / 2).length,
    assemblyBases,
  };
};
export const exampleInput = { contigLengths: [6, 3, 1] } satisfies Input;
export const exampleOutput = { n50: 6, assemblyBases: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contigLengths: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["contigLengths"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n50: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    assemblyBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["n50", "assemblyBases"],
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
  for (let index = 0; index < input.contigLengths.length; index++)
    if (!Object.hasOwn(input.contigLengths, index))
      return invalidInput([{ code: "invalid_field", field: "contigLengths", message: "A dense numeric list is required." }]);
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
  id: "genomics/assembly-n50",
  title: "Assembly N50",
  description: "Find the contig length at which descending cumulative length reaches half the assembly.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "contigLengths",
        label: "Contig lengths",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "n50",
        label: "N50",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "assemblyBases",
        label: "Assembly bases",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
