import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction } from "../shared.js";

export type Input = Readonly<{
  readonly effectLabels: readonly string[];
  readonly deltaScores: readonly number[];
}>;
export type Output = Readonly<{
  readonly rankedEffects: readonly string[];
  readonly rankedScores: readonly number[];
  readonly topEffect: string;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (input.effectLabels.length !== input.deltaScores.length)
    simpleError("deltaScores", "Scores must align with effect labels.");
  if (new Set(input.effectLabels).size !== input.effectLabels.length)
    simpleError("effectLabels", "Effect labels must be distinct.");
  input.deltaScores.forEach((v) => fraction(v, "deltaScores"));
  const indexes = input.deltaScores
    .map((_, i) => i)
    .sort((a, b) => input.deltaScores[b] - input.deltaScores[a] || a - b);
  return {
    rankedEffects: indexes.map((i) => input.effectLabels[i]),
    rankedScores: indexes.map((i) => input.deltaScores[i]),
    topEffect: input.effectLabels[indexes[0]],
  };
};
export const exampleInput = {
  effectLabels: ["acceptor-gain", "acceptor-loss", "donor-gain", "donor-loss"],
  deltaScores: [0.1, 0.8, 0.2, 0.3],
} satisfies Input;
export const exampleOutput = {
  rankedEffects: ["acceptor-loss", "donor-loss", "donor-gain", "acceptor-gain"],
  rankedScores: [0.8, 0.3, 0.2, 0.1],
  topEffect: "acceptor-loss",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectLabels: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 1,
      maxItems: 100000,
    },
    deltaScores: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["effectLabels", "deltaScores"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rankedEffects: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 1,
      maxItems: 100000,
      description: "Descending scores; ties retain input order.",
    },
    rankedScores: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
    topEffect: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "\\S",
    },
  },
  required: ["rankedEffects", "rankedScores", "topEffect"],
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
  id: "genomics/splice-delta-effect-rank",
  title: "Splice Delta Effect Rank",
  description: "Rank caller-supplied splice delta effect scores without predicting clinical pathogenicity.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "effectLabels",
        label: "Effect labels",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "deltaScores",
        label: "Delta scores",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
    ],
    outputs: [
      {
        id: "rankedEffects",
        label: "Ranked effects",
        description: "Descending scores; ties retain input order.",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "rankedScores",
        label: "Ranked scores",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "topEffect",
        label: "Top effect",
        valueType: {
          type: "string",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
