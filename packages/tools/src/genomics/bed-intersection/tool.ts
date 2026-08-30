import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly firstChromosome: string;
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondChromosome: string;
  readonly secondStart: number;
  readonly secondEnd: number;
}>;
export type Output = Readonly<{
  readonly overlapBases: number;
  readonly intersectionStart: number;
  readonly intersectionEnd: number;
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (0-based coordinate systems)
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.firstEnd < input.firstStart)
    simpleError("firstEnd", "BED end must be at or after its start.");
  if (input.secondEnd < input.secondStart)
    simpleError("secondEnd", "BED end must be at or after its start.");
  const start = Math.max(0, input.firstStart, input.secondStart);
  const end = Math.min(input.firstEnd, input.secondEnd);
  const overlapBases = input.firstChromosome === input.secondChromosome ? Math.max(0, end - start) : 0;
  return { overlapBases, intersectionStart: overlapBases > 0 ? start : -1, intersectionEnd: overlapBases > 0 ? end : -1 };
};
export const exampleInput = {
  firstChromosome: "chr1",
  firstStart: 10,
  firstEnd: 30,
  secondChromosome: "chr1",
  secondStart: 20,
  secondEnd: 40,
} satisfies Input;
export const exampleOutput = {
  overlapBases: 10,
  intersectionStart: 20,
  intersectionEnd: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstChromosome: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "\\S",
    },
    firstStart: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    firstEnd: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    secondChromosome: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "\\S",
    },
    secondStart: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    secondEnd: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["firstChromosome", "firstStart", "firstEnd", "secondChromosome", "secondStart", "secondEnd"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    intersectionStart: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
    },
    intersectionEnd: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
    },
  },
  required: ["overlapBases", "intersectionStart", "intersectionEnd"],
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
  id: "genomics/bed-intersection",
  title: "BED Intersection",
  description: "Intersect two chromosome-aware zero-based half-open BED intervals.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "firstChromosome",
        label: "First chromosome",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "firstStart",
        label: "First start",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "firstEnd",
        label: "First end",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "secondChromosome",
        label: "Second chromosome",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "secondStart",
        label: "Second start",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "secondEnd",
        label: "Second end",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "overlapBases",
        label: "Overlap bases",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "intersectionStart",
        label: "Intersection start",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "intersectionEnd",
        label: "Intersection end",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
