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
  readonly foldCoverage: number;
  readonly genomeBases: number;
}>;
export type Output = Readonly<{
  readonly uncoveredFraction: number;
  readonly expectedUncoveredBases: number;
}>;
// https://pmc.ncbi.nlm.nih.gov/articles/PMC2430974/
export const calculate = (input: Input): Output => {
  if (!Number.isFinite(input.foldCoverage) || input.foldCoverage < 0)
    simpleError("foldCoverage", "Coverage must be nonnegative.");
  count(input.genomeBases, "genomeBases", 1);
  const uncoveredFraction = Math.exp(-input.foldCoverage);
  // Scale before exponentiation when the probability is subnormal or underflows.
  const expectedUncoveredBases = uncoveredFraction < 2 ** -1022
    ? Math.exp(Math.log(input.genomeBases) - input.foldCoverage)
    : input.genomeBases * uncoveredFraction;
  return {
    uncoveredFraction,
    expectedUncoveredBases,
  };
};
export const exampleInput = {
  foldCoverage: 1,
  genomeBases: 1000,
} satisfies Input;
export const exampleOutput = {
  uncoveredFraction: 0.36787944117144233,
  expectedUncoveredBases: 367.87944117144235,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foldCoverage: {
      type: "number",
      minimum: 0,
    },
    genomeBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["foldCoverage", "genomeBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncoveredFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    expectedUncoveredBases: {
      type: "number",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["uncoveredFraction", "expectedUncoveredBases"],
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
  id: "genomics/poisson-uncovered-fraction",
  title: "Poisson Uncovered Fraction",
  description: "Estimate uncovered genome fraction under the uniform independent Poisson coverage model.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "foldCoverage",
        label: "Fold coverage",
        required: true,
        valueType: {
          type: "number",
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
        id: "uncoveredFraction",
        label: "Uncovered fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "expectedUncoveredBases",
        label: "Expected uncovered bases",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
