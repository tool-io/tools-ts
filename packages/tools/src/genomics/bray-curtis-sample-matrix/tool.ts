import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { rectangular } from "../shared.js";

export type Input = Readonly<{
  readonly sampleCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly dissimilarityMatrix: readonly (readonly number[])[];
}>;
// https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.braycurtis.html
export const calculate = (input: Input): Output => {
  validateInput(input);
  rectangular(input.sampleCounts, "sampleCounts");
  const samples = input.sampleCounts;
  if (samples.some((row) => !row.some((v) => v > 0)))
    simpleError("sampleCounts", "Every sample requires a positive abundance.");
  const dissimilarityMatrix = samples.map(() => samples.map(() => 0));
  for (let i = 0; i < samples.length; i++) {
    for (let j = i + 1; j < samples.length; j++) {
      let numerator = 0, denominator = 0, scale = 0;
      for (let k = 0; k < samples[i].length; k++) {
        const a = samples[i][k], b = samples[j][k];
        numerator += Math.abs(a - b);
        denominator += a + b;
        scale = Math.max(scale, a, b);
      }
      // The ratio is invariant under scaling. Only scale when ordinary sums overflow.
      if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) {
        numerator = 0;
        denominator = 0;
        for (let k = 0; k < samples[i].length; k++) {
          const a = samples[i][k] / scale, b = samples[j][k] / scale;
          numerator += Math.abs(a - b);
          denominator += a + b;
        }
      }
      const distance = numerator / denominator;
      dissimilarityMatrix[i][j] = distance;
      dissimilarityMatrix[j][i] = distance;
    }
  }
  return { dissimilarityMatrix };
};
export const exampleInput = {
  sampleCounts: [
    [1, 0],
    [0, 1],
    [1, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  dissimilarityMatrix: [
    [0, 1, 0.3333333333333333],
    [1, 0, 0.3333333333333333],
    [0.3333333333333333, 0.3333333333333333, 0],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleCounts: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "number",
          minimum: 0,
        },
        minItems: 1,
        maxItems: 128,
      },
      minItems: 1,
      maxItems: 128,
    },
  },
  required: ["sampleCounts"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dissimilarityMatrix: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        minItems: 1,
        maxItems: 128,
      },
      minItems: 1,
      maxItems: 128,
    },
  },
  required: ["dissimilarityMatrix"],
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
  id: "genomics/bray-curtis-sample-matrix",
  title: "Bray Curtis Sample Matrix",
  description: "Build a Bray–Curtis pairwise dissimilarity matrix for samples with aligned taxa.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sampleCounts",
        label: "Sample counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "list",
            items: {
              type: "number",
            },
          },
        },
      },
    ],
    outputs: [
      {
        id: "dissimilarityMatrix",
        label: "Dissimilarity matrix",
        valueType: {
          type: "list",
          items: {
            type: "list",
            items: {
              type: "number",
            },
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
