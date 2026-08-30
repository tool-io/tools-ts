import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly queryGenes: readonly string[];
  readonly forwardHits: readonly string[];
  readonly targetGenes: readonly string[];
  readonly reverseHits: readonly string[];
}>;
export type Output = Readonly<{
  readonly reciprocalQueries: readonly string[];
  readonly reciprocalTargets: readonly string[];
  readonly pairCount: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.queryGenes.length !== input.forwardHits.length)
    simpleError("forwardHits", "Forward hits must align with queries.");
  if (input.targetGenes.length !== input.reverseHits.length)
    simpleError("reverseHits", "Reverse hits must align with targets.");
  if (new Set(input.queryGenes).size !== input.queryGenes.length)
    simpleError("queryGenes", "Query genes must be distinct.");
  if (new Set(input.targetGenes).size !== input.targetGenes.length)
    simpleError("targetGenes", "Target genes must be distinct.");
  const reverse = new Map(input.targetGenes.map((v, i) => [v, input.reverseHits[i]]));
  const indexes = input.queryGenes.flatMap((v, i) => reverse.get(input.forwardHits[i]) === v ? [i] : []);
  return { reciprocalQueries: indexes.map((i) => input.queryGenes[i]), reciprocalTargets: indexes.map((i) => input.forwardHits[i]), pairCount: indexes.length };
};
export const exampleInput = {
  queryGenes: ["A", "B"],
  forwardHits: ["X", "Y"],
  targetGenes: ["X", "Y"],
  reverseHits: ["A", "C"],
} satisfies Input;
export const exampleOutput = {
  reciprocalQueries: ["A"],
  reciprocalTargets: ["X"],
  pairCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryGenes: {
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
    forwardHits: {
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
    targetGenes: {
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
    reverseHits: {
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
  required: ["queryGenes", "forwardHits", "targetGenes", "reverseHits"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reciprocalQueries: {
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
    reciprocalTargets: {
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
    pairCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["reciprocalQueries", "reciprocalTargets", "pairCount"],
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
  id: "genomics/reciprocal-best-hit-pairs",
  title: "Reciprocal Best Hit Pairs",
  description: "Validate reciprocal best-hit gene pairs from independently supplied forward and reverse maps.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "queryGenes",
        label: "Query genes",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "forwardHits",
        label: "Forward hits",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "targetGenes",
        label: "Target genes",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "reverseHits",
        label: "Reverse hits",
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
        id: "reciprocalQueries",
        label: "Reciprocal queries",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "reciprocalTargets",
        label: "Reciprocal targets",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "pairCount",
        label: "Pair count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
