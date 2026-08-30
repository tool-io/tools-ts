import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly copyNumberStates: readonly number[];
}>;
export type Output = Readonly<{
  readonly switchCount: number;
  readonly distinctStates: number;
  readonly twoStateOscillation: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.copyNumberStates, "copyNumberStates");
  const distinctStates = new Set(input.copyNumberStates).size,
    switchCount = input.copyNumberStates
      .slice(1)
      .filter((v, i) => v !== input.copyNumberStates[i]).length;
  return {
    switchCount,
    distinctStates,
    twoStateOscillation: distinctStates === 2 && switchCount >= 2,
  };
};
export const exampleInput = {
  copyNumberStates: [1, 2, 1, 2, 2, 1],
} satisfies Input;
export const exampleOutput = {
  switchCount: 4,
  distinctStates: 2,
  twoStateOscillation: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copyNumberStates: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["copyNumberStates"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    switchCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    distinctStates: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    twoStateOscillation: {
      type: "boolean",
      description: "Exactly two supplied states and at least two switches; consecutive equal states do not switch.",
    },
  },
  required: ["switchCount", "distinctStates", "twoStateOscillation"],
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
  id: "genomics/copy-number-switches",
  title: "Copy Number Switches",
  description: "Count copy-number state switches as an oscillation feature, not a chromothripsis diagnosis.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "copyNumberStates",
        label: "Copy number states",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
    outputs: [
      {
        id: "switchCount",
        label: "Switch count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "distinctStates",
        label: "Distinct states",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "twoStateOscillation",
        label: "Two state oscillation",
        description: "Exactly two supplied states and at least two switches; consecutive equal states do not switch.",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
