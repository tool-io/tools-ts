import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, dna, reverseDNA } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly armLength: number;
  readonly spacerLength: number;
}>;
export type Output = Readonly<{
  readonly leftArmStarts: readonly number[];
  readonly rightArmStarts: readonly number[];
  readonly repeatCount: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const s = dna(input.sequence);
  count(input.armLength, "armLength", 1);
  count(input.spacerLength, "spacerLength");
  if (input.armLength > Math.floor(s.length / 2) || input.spacerLength > s.length - 2 * input.armLength)
    return { leftArmStarts: [], rightArmStarts: [], repeatCount: 0 };
  if ((s.length - 2 * input.armLength - input.spacerLength + 1) * input.armLength > 10000000)
    simpleError("armLength", "Arm comparison exceeds the operation budget.");
  const span = 2 * input.armLength + input.spacerLength,
    leftArmStarts: number[] = [],
    rightArmStarts: number[] = [];
  for (let i = 0; i + span <= s.length; i++) {
    const right = i + input.armLength + input.spacerLength;
    if (
      s.slice(i, i + input.armLength) ===
      reverseDNA(s.slice(right, right + input.armLength))
    ) {
      leftArmStarts.push(i);
      rightArmStarts.push(right);
      if (leftArmStarts.length > 100000)
        simpleError("sequence", "Output is limited to 100000 repeat pairs.");
    }
  }
  return { leftArmStarts, rightArmStarts, repeatCount: leftArmStarts.length };
};
export const exampleInput = {
  sequence: "ATGCAT",
  armLength: 3,
  spacerLength: 0,
} satisfies Input;
export const exampleOutput = {
  leftArmStarts: [0],
  rightArmStarts: [3],
  repeatCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
    armLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    spacerLength: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["sequence", "armLength", "spacerLength"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftArmStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    rightArmStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    repeatCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["leftArmStarts", "rightArmStarts", "repeatCount"],
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
  id: "genomics/inverted-repeat-scan",
  title: "Inverted Repeat Scan",
  description: "Find reverse-complement DNA arms separated by a caller-selected spacer length.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sequence",
        label: "Sequence",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "armLength",
        label: "Arm length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "spacerLength",
        label: "Spacer length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "leftArmStarts",
        label: "Left arm starts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "rightArmStarts",
        label: "Right arm starts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "repeatCount",
        label: "Repeat count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
