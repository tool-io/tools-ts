import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly synonymousDistance: number;
  readonly substitutionsPerSitePerYear: number;
}>;
export type Output = Readonly<{
  readonly divergenceYears: number;
  readonly divergenceMillionYears: number;
}>;
// https://pmc.ncbi.nlm.nih.gov/articles/PMC7329397/ (t = Ks / 2r, with caller-supplied rate)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const denominator = 2 * input.substitutionsPerSitePerYear;
  const divergenceYears = Number.isFinite(denominator) ? input.synonymousDistance / denominator : (input.synonymousDistance / input.substitutionsPerSitePerYear) / 2;
  if (!Number.isFinite(divergenceYears))
    simpleError("substitutionsPerSitePerYear", "Divergence time exceeds the finite number range.", "result_overflow");
  return { divergenceYears, divergenceMillionYears: divergenceYears / 1e6 };
};
export const exampleInput = {
  synonymousDistance: 0.02,
  substitutionsPerSitePerYear: 1e-8,
} satisfies Input;
export const exampleOutput = {
  divergenceYears: 1000000,
  divergenceMillionYears: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    synonymousDistance: {
      type: "number",
      minimum: 0,
    },
    substitutionsPerSitePerYear: {
      type: "number",
      exclusiveMinimum: 0,
      description: "Synonymous substitution rate per site per year on each of two equally evolving branches.",
    },
  },
  required: ["synonymousDistance", "substitutionsPerSitePerYear"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    divergenceYears: {
      type: "number",
      minimum: 0,
    },
    divergenceMillionYears: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["divergenceYears", "divergenceMillionYears"],
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
  id: "genomics/synonymous-clock-divergence",
  title: "Synonymous Clock Divergence",
  description: "Estimate divergence time from dS assuming equal constant substitution rates on both lineages.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "synonymousDistance",
        label: "Synonymous distance",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "substitutionsPerSitePerYear",
        label: "Substitutions per site per year",
        required: true,
        description: "Synonymous substitution rate per site per year on each of two equally evolving branches.",
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "divergenceYears",
        label: "Divergence years",
        valueType: {
          type: "number",
        },
      },
      {
        id: "divergenceMillionYears",
        label: "Divergence million years",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
