import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly referenceBases: readonly string[];
  readonly alternateBases: readonly string[];
  readonly minimumRatio: number;
  readonly maximumRatio: number;
}>;
export type Output = Readonly<{
  readonly transitions: number;
  readonly transversions: number;
  readonly titvRatio: number;
  readonly withinRange: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.referenceBases.length;
  if (input.alternateBases.length !== n)
    simpleError("alternateBases", "Alternate bases must align with reference bases.");
  if (input.maximumRatio < input.minimumRatio)
    simpleError("maximumRatio", "Maximum ratio must be at least the minimum.");
  let transitions = 0;
  for (let i = 0; i < n; i++) {
    const a = input.referenceBases[i].trim().toUpperCase();
    const b = input.alternateBases[i].trim().toUpperCase();
    if (a === b) simpleError("alternateBases", "Alternate bases must differ from references.");
    if (["AG", "GA", "CT", "TC"].includes(a + b)) transitions++;
  }
  const transversions = n - transitions;
  positive(transversions, "alternateBases");
  const titvRatio = transitions / transversions;
  return { transitions, transversions, titvRatio, withinRange: titvRatio >= input.minimumRatio && titvRatio <= input.maximumRatio };
};
export const exampleInput = {
  referenceBases: ["A", "C", "A", "G"],
  alternateBases: ["G", "T", "C", "T"],
  minimumRatio: 0.5,
  maximumRatio: 2,
} satisfies Input;
export const exampleOutput = {
  transitions: 2,
  transversions: 2,
  titvRatio: 1,
  withinRange: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceBases: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "^\\s*[ACGTacgt]\\s*$",
      },
      minItems: 1,
      maxItems: 100000,
    },
    alternateBases: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "^\\s*[ACGTacgt]\\s*$",
      },
      minItems: 1,
      maxItems: 100000,
    },
    minimumRatio: {
      type: "number",
      minimum: 0,
    },
    maximumRatio: {
      type: "number",
      minimum: 0,
    },
  },
  required: ["referenceBases", "alternateBases", "minimumRatio", "maximumRatio"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transitions: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    transversions: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    titvRatio: {
      type: "number",
      minimum: 0,
    },
    withinRange: {
      type: "boolean",
    },
  },
  required: ["transitions", "transversions", "titvRatio", "withinRange"],
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
  id: "genomics/transition-transversion-ratio",
  title: "Transition Transversion Ratio",
  description: "Classify substitutions as transitions or transversions and compare Ti/Tv with supplied bounds.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "referenceBases",
        label: "Reference bases",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "alternateBases",
        label: "Alternate bases",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "minimumRatio",
        label: "Minimum ratio",
        required: true,
        valueType: {
          type: "number",
        },
      },
      {
        id: "maximumRatio",
        label: "Maximum ratio",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "transitions",
        label: "Transitions",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "transversions",
        label: "Transversions",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "titvRatio",
        label: "Titv ratio",
        valueType: {
          type: "number",
        },
      },
      {
        id: "withinRange",
        label: "Within range",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
