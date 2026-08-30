import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive, rectangular } from "../shared.js";

export type Input = Readonly<{
  readonly taxonSampleCounts: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly columnTotals: readonly number[];
  readonly abundancePercent: readonly (readonly number[])[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  rectangular(input.taxonSampleCounts, "taxonSampleCounts");
  const m = input.taxonSampleCounts;
  const columnTotals = m[0].map((_, j) => m.reduce((sum, row) => sum + row[j], 0));
  if (columnTotals.some((v) => !Number.isFinite(v)))
    simpleError("taxonSampleCounts", "Column totals exceed the finite number range.", "result_overflow");
  columnTotals.forEach((v) => positive(v, "taxonSampleCounts"));
  return {
    columnTotals,
    abundancePercent: m.map((row) => row.map((v, j) => (v / columnTotals[j]) * 100)),
  };
};
export const exampleInput = {
  taxonSampleCounts: [
    [1, 3],
    [3, 1],
  ],
} satisfies Input;
export const exampleOutput = {
  columnTotals: [4, 4],
  abundancePercent: [
    [25, 75],
    [75, 25],
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
    taxonSampleCounts: {
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
  required: ["taxonSampleCounts"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    columnTotals: {
      type: "array",
      items: {
        type: "number",
        exclusiveMinimum: 0,
      },
      minItems: 1,
      maxItems: 128,
    },
    abundancePercent: {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
        minItems: 1,
        maxItems: 128,
      },
      minItems: 1,
      maxItems: 128,
    },
  },
  required: ["columnTotals", "abundancePercent"],
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
  id: "genomics/abundance-column-percent",
  title: "Abundance Column Percent",
  description: "Normalize a taxa-by-sample abundance matrix to percentages within each sample column.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "taxonSampleCounts",
        label: "Taxon sample counts",
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
        id: "columnTotals",
        label: "Column totals",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "abundancePercent",
        label: "Abundance percent",
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
