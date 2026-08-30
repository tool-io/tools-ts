import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, assemblyNx } from "../shared.js";

export type Input = Readonly<{
  readonly contigLengths: readonly number[];
  readonly referenceGenomeBases: number;
}>;
export type Output = Readonly<{
  readonly ng50: number;
  readonly thresholdReached: boolean;
}>;
// https://quast.sourceforge.net/docs/manual.html#sec3.1
export const calculate = (input: Input): Output => {
  count(input.referenceGenomeBases, "referenceGenomeBases", 1);
  const result = assemblyNx(
    input.contigLengths,
    input.referenceGenomeBases / 2,
  );
  return { ng50: result.length, thresholdReached: result.reached };
};
export const exampleInput = {
  contigLengths: [6, 3, 1],
  referenceGenomeBases: 20,
} satisfies Input;
export const exampleOutput = {
  ng50: 1,
  thresholdReached: true,
} satisfies Output;
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
    referenceGenomeBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
      description: "Reference genome length in bases; half this length sets the NG50 threshold.",
    },
  },
  required: ["contigLengths", "referenceGenomeBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ng50: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    thresholdReached: {
      type: "boolean",
    },
  },
  required: ["ng50", "thresholdReached"],
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
  id: "genomics/reference-ng50",
  title: "Reference NG50",
  description: "Find NG50 against half the reference genome length; flag assemblies below that threshold.",
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
      {
        id: "referenceGenomeBases",
        label: "Reference genome bases",
        required: true,
        description: "Reference genome length in bases; half this length sets the NG50 threshold.",
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "ng50",
        label: "NG50",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "thresholdReached",
        label: "Threshold reached",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
