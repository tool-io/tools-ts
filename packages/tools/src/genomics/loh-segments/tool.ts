import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly segmentStarts: readonly number[];
  readonly segmentEnds: readonly number[];
  readonly minorCopyNumbers: readonly number[];
  readonly maximumMinorCopies: number;
}>;
export type Output = Readonly<{
  readonly lohStarts: readonly number[];
  readonly lohEnds: readonly number[];
  readonly lohBases: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.segmentStarts, "segmentStarts");
  counts(input.segmentEnds, "segmentEnds");
  counts(input.minorCopyNumbers, "minorCopyNumbers");
  const n = input.segmentStarts.length;
  if (n !== input.segmentEnds.length)
    simpleError("segmentEnds", "Segment ends must align with starts.");
  if (n !== input.minorCopyNumbers.length)
    simpleError("minorCopyNumbers", "Minor-copy states must align with segments.");
  for (let i = 0; i < n; i++) {
    if (input.segmentEnds[i] <= input.segmentStarts[i])
      simpleError("segmentEnds", "Segments must have positive half-open lengths.");
    if (i > 0 && input.segmentStarts[i] < input.segmentEnds[i - 1])
      simpleError("segmentStarts", "Segments must be ordered and disjoint.");
  }
  const lohStarts: number[] = [],
    lohEnds: number[] = [];
  for (let i = 0; i < n; i++)
    if (input.minorCopyNumbers[i] <= input.maximumMinorCopies) {
      const last = lohEnds.length - 1;
      if (last >= 0 && lohEnds[last] === input.segmentStarts[i])
        lohEnds[last] = input.segmentEnds[i];
      else {
        lohStarts.push(input.segmentStarts[i]);
        lohEnds.push(input.segmentEnds[i]);
      }
    }
  return {
    lohStarts,
    lohEnds,
    lohBases: lohEnds.reduce((sum, v, i) => sum + (v - lohStarts[i]), 0),
  };
};
export const exampleInput = {
  segmentStarts: [0, 10, 20],
  segmentEnds: [10, 20, 30],
  minorCopyNumbers: [0, 0, 1],
  maximumMinorCopies: 0,
} satisfies Input;
export const exampleOutput = {
  lohStarts: [0],
  lohEnds: [20],
  lohBases: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    segmentEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    minorCopyNumbers: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
      description: "Nonnegative integer minor-allele copy states; no inference from read depth.",
    },
    maximumMinorCopies: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["segmentStarts", "segmentEnds", "minorCopyNumbers", "maximumMinorCopies"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lohStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    lohEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    lohBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["lohStarts", "lohEnds", "lohBases"],
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
  id: "genomics/loh-segments",
  title: "Loh Segments",
  description: "Merge contiguous segments meeting a supplied minor-allele copy-number LOH criterion.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "segmentStarts",
        label: "Segment starts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "segmentEnds",
        label: "Segment ends",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minorCopyNumbers",
        label: "Minor copy numbers",
        required: true,
        description: "Nonnegative integer minor-allele copy states; no inference from read depth.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "maximumMinorCopies",
        label: "Maximum minor copies",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "lohStarts",
        label: "Loh starts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "lohEnds",
        label: "Loh ends",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "lohBases",
        label: "Loh bases",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
