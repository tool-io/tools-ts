import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, counts } from "../shared.js";

export type Input = Readonly<{
  readonly mappingQualities: readonly number[];
  readonly minimumMapq: number;
}>;
export type Output = Readonly<{
  readonly passingIndexes: readonly number[];
  readonly unknownQualityCount: number;
  readonly passPercent: number;
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (MAPQ 255)
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.mappingQualities, "mappingQualities");
  count(input.minimumMapq, "minimumMapq");
  if (input.minimumMapq > 254 || input.mappingQualities.some((v) => v > 255))
    simpleError(
      "mappingQualities",
      "SAM mapping qualities are 0–255, with 255 unavailable.",
    );
  const passingIndexes = input.mappingQualities.flatMap((v, i) =>
    v !== 255 && v >= input.minimumMapq ? [i] : [],
  );
  return {
    passingIndexes,
    unknownQualityCount: input.mappingQualities.filter((v) => v === 255).length,
    passPercent: (100 * passingIndexes.length) / input.mappingQualities.length,
  };
};
export const exampleInput = {
  mappingQualities: [0, 20, 60, 255],
  minimumMapq: 20,
} satisfies Input;
export const exampleOutput = {
  passingIndexes: [1, 2],
  unknownQualityCount: 1,
  passPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mappingQualities: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 255,
      },
      minItems: 1,
      maxItems: 100000,
      description: "SAM MAPQ integers 0 through 255; 255 is unavailable and never passes.",
    },
    minimumMapq: {
      type: "integer",
      minimum: 0,
      maximum: 254,
    },
  },
  required: ["mappingQualities", "minimumMapq"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passingIndexes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    unknownQualityCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    passPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
      description: "Percentage of all supplied reads that pass, including unavailable qualities in the denominator.",
    },
  },
  required: ["passingIndexes", "unknownQualityCount", "passPercent"],
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
  id: "genomics/mapq-filter-fraction",
  title: "MAPQ Filter Fraction",
  description: "Filter SAM mapping qualities by threshold while treating MAPQ 255 as unavailable.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mappingQualities",
        label: "Mapping qualities",
        required: true,
        description: "SAM MAPQ integers 0 through 255; 255 is unavailable and never passes.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumMapq",
        label: "Minimum mapq",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "passingIndexes",
        label: "Passing indexes",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "unknownQualityCount",
        label: "Unknown quality count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "passPercent",
        label: "Pass percent",
        description: "Percentage of all supplied reads that pass, including unavailable qualities in the denominator.",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
