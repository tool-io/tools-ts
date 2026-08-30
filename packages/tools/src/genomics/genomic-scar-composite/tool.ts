import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly lohEvents: number;
  readonly telomericImbalances: number;
  readonly largeTransitions: number;
  readonly componentWeights: readonly number[];
  readonly scoreThreshold: number;
}>;
export type Output = Readonly<{
  readonly compositeScore: number;
  readonly aboveThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const compositeScore = [input.lohEvents, input.telomericImbalances, input.largeTransitions].reduce((sum, v, i) => sum + v * input.componentWeights[i], 0);
  if (!Number.isFinite(compositeScore))
    simpleError("componentWeights", "Weighted score exceeds the finite number range.", "result_overflow");
  return { compositeScore, aboveThreshold: compositeScore >= input.scoreThreshold };
};
export const exampleInput = {
  lohEvents: 3,
  telomericImbalances: 2,
  largeTransitions: 4,
  componentWeights: [1, 2, 1],
  scoreThreshold: 10,
} satisfies Input;
export const exampleOutput = {
  compositeScore: 11,
  aboveThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lohEvents: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    telomericImbalances: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    largeTransitions: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    componentWeights: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
      },
      minItems: 3,
      maxItems: 3,
    },
    scoreThreshold: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["lohEvents", "telomericImbalances", "largeTransitions", "componentWeights", "scoreThreshold"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compositeScore: {
      type: "number",
      minimum: 0,
    },
    aboveThreshold: {
      type: "boolean",
    },
  },
  required: ["compositeScore", "aboveThreshold"],
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
  id: "genomics/genomic-scar-composite",
  title: "Genomic Scar Composite",
  description: "Combine supplied LOH, telomeric imbalance, and large-transition counts with explicit weights; not a clinical HRD test.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "lohEvents",
        label: "Loh events",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "telomericImbalances",
        label: "Telomeric imbalances",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "largeTransitions",
        label: "Large transitions",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "componentWeights",
        label: "Component weights",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
      {
        id: "scoreThreshold",
        label: "Score threshold",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "compositeScore",
        label: "Composite score",
        valueType: {
          type: "number",
        },
      },
      {
        id: "aboveThreshold",
        label: "Above threshold",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
