import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly errorProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly phredScores: readonly number[];
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (section 1.4, QUAL)
export const calculate = (input: Input): Output => {
  if (!input.errorProbabilities.length)
    simpleError("errorProbabilities", "Nonempty error probabilities required.");
  input.errorProbabilities.forEach((v) => {
    fraction(v, "errorProbabilities");
    positive(v, "errorProbabilities");
  });
  return {
    phredScores: input.errorProbabilities.map((v) => v === 1 ? 0 : -10 * Math.log10(v)),
  };
};
export const exampleInput = {
  errorProbabilities: [0.1, 0.01, 0.001],
} satisfies Input;
export const exampleOutput = { phredScores: [10, 20, 30] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    errorProbabilities: {
      type: "array",
      items: {
        type: "number",
        exclusiveMinimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["errorProbabilities"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phredScores: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["phredScores"],
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
  for (let index = 0; index < input.errorProbabilities.length; index++)
    if (!Object.hasOwn(input.errorProbabilities, index))
      return invalidInput([{ code: "invalid_field", field: "errorProbabilities", message: "A dense numeric list is required." }]);
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
  id: "genomics/error-probability-phred",
  title: "Error Probability Phred",
  description: "Convert error probabilities in (0,1] to Phred quality scores.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "errorProbabilities",
        label: "Error probabilities",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
    ],
    outputs: [
      {
        id: "phredScores",
        label: "Phred scores",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
