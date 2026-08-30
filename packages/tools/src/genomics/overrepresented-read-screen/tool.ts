import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, fraction, counts } from "../shared.js";

export type Input = Readonly<{
  readonly sequenceCounts: readonly number[];
  readonly totalReads: number;
  readonly maximumFraction: number;
}>;
export type Output = Readonly<{
  readonly sequenceFractions: readonly number[];
  readonly flaggedIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.sequenceCounts, "sequenceCounts");
  count(input.totalReads, "totalReads", 1);
  fraction(input.maximumFraction, "maximumFraction");
  if (input.sequenceCounts.some((v) => v > input.totalReads))
    simpleError(
      "sequenceCounts",
      "Individual sequence counts cannot exceed total reads.",
    );
  let remaining = input.totalReads;
  for (const count of input.sequenceCounts) {
    if (count > remaining) simpleError("sequenceCounts", "Distinct sequence counts cannot exceed total reads.");
    remaining -= count;
  }
  const sequenceFractions = input.sequenceCounts.map(
    (v) => v / input.totalReads,
  );
  return {
    sequenceFractions,
    flaggedIndexes: sequenceFractions.flatMap((v, i) =>
      v > input.maximumFraction ? [i] : [],
    ),
  };
};
export const exampleInput = {
  sequenceCounts: [10, 40],
  totalReads: 100,
  maximumFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  sequenceFractions: [0.1, 0.4],
  flaggedIndexes: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequenceCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
      description: "Counts of distinct exact sequences among totalReads; the sum cannot exceed totalReads.",
    },
    totalReads: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    maximumFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["sequenceCounts", "totalReads", "maximumFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequenceFractions: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
    flaggedIndexes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["sequenceFractions", "flaggedIndexes"],
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
  id: "genomics/overrepresented-read-screen",
  title: "Overrepresented Read Screen",
  description: "Flag exact-sequence read abundance fractions above a caller-defined overrepresentation ceiling.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sequenceCounts",
        label: "Sequence counts",
        required: true,
        description: "Counts of distinct exact sequences among totalReads; the sum cannot exceed totalReads.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "totalReads",
        label: "Total reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "maximumFraction",
        label: "Maximum fraction",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "sequenceFractions",
        label: "Sequence fractions",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "flaggedIndexes",
        label: "Flagged indexes",
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
