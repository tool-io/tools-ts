import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly referenceOrder: readonly string[];
  readonly comparisonOrder: readonly string[];
}>;
export type Output = Readonly<{
  readonly conservedAdjacentPairs: number;
  readonly possibleAdjacentPairs: number;
  readonly collinearityFraction: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const a = input.referenceOrder,
    b = input.comparisonOrder;
  if (new Set(a).size !== a.length)
    simpleError("referenceOrder", "Reference genes must be distinct.");
  if (new Set(b).size !== b.length)
    simpleError("comparisonOrder", "Comparison genes must be distinct.");
  const index = new Map(b.map((v, i) => [v, i]));
  let conservedAdjacentPairs = 0;
  for (let i = 1; i < a.length; i++) {
    const p = index.get(a[i - 1]),
      q = index.get(a[i]);
    if (p !== undefined && q !== undefined && q === p + 1)
      conservedAdjacentPairs++;
  }
  return {
    conservedAdjacentPairs,
    possibleAdjacentPairs: a.length - 1,
    collinearityFraction: conservedAdjacentPairs / (a.length - 1),
  };
};
export const exampleInput = {
  referenceOrder: ["A", "B", "C", "D"],
  comparisonOrder: ["A", "B", "D", "C"],
} satisfies Input;
export const exampleOutput = {
  conservedAdjacentPairs: 1,
  possibleAdjacentPairs: 3,
  collinearityFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceOrder: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 2,
      maxItems: 100000,
    },
    comparisonOrder: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["referenceOrder", "comparisonOrder"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conservedAdjacentPairs: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Adjacent reference pairs retained in the same direction in comparisonOrder.",
    },
    possibleAdjacentPairs: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    collinearityFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["conservedAdjacentPairs", "possibleAdjacentPairs", "collinearityFraction"],
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
  id: "genomics/synteny-order-conservation",
  title: "Synteny Order Conservation",
  description: "Score directional adjacent-gene order conservation between supplied syntenic blocks.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "referenceOrder",
        label: "Reference order",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "comparisonOrder",
        label: "Comparison order",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
    ],
    outputs: [
      {
        id: "conservedAdjacentPairs",
        label: "Conserved adjacent pairs",
        description: "Adjacent reference pairs retained in the same direction in comparisonOrder.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "possibleAdjacentPairs",
        label: "Possible adjacent pairs",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "collinearityFraction",
        label: "Collinearity fraction",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
