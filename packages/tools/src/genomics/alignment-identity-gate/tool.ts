import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly firstAlignment: string;
  readonly secondAlignment: string;
  readonly minimumIdentityFraction: number;
}>;
export type Output = Readonly<{
  readonly comparedColumns: number;
  readonly matchingColumns: number;
  readonly identityFraction: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const a = input.firstAlignment.toUpperCase();
  const b = input.secondAlignment.toUpperCase();
  if (a.length !== b.length)
    simpleError("secondAlignment", "Alignments must have the same number of columns.");
  let matchingColumns = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "-" && b[i] === "-")
      simpleError("secondAlignment", "Double-gap columns are not alignment columns.");
    if (a[i] === b[i] && a[i] !== "-") matchingColumns++;
  }
  const identityFraction = matchingColumns / a.length;
  return { comparedColumns: a.length, matchingColumns, identityFraction, passes: identityFraction >= input.minimumIdentityFraction };
};
export const exampleInput = {
  firstAlignment: "AC-GT",
  secondAlignment: "ACTGT",
  minimumIdentityFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  comparedColumns: 5,
  matchingColumns: 4,
  identityFraction: 0.8,
  passes: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAlignment: {
      type: "string",
      maxLength: 1000000,
      minLength: 1,
      pattern: "^[ACGTacgt-]+(?![\\s\\S])",
    },
    secondAlignment: {
      type: "string",
      maxLength: 1000000,
      minLength: 1,
      pattern: "^[ACGTacgt-]+(?![\\s\\S])",
    },
    minimumIdentityFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "Matching nongap bases divided by all columns; single-gap columns count as mismatches.",
    },
  },
  required: ["firstAlignment", "secondAlignment", "minimumIdentityFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparedColumns: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    matchingColumns: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    identityFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    passes: {
      type: "boolean",
    },
  },
  required: ["comparedColumns", "matchingColumns", "identityFraction", "passes"],
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
  id: "genomics/alignment-identity-gate",
  title: "Alignment Identity Gate",
  description: "Gate segmental-duplication alignment identity including single-gap columns as mismatches.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "firstAlignment",
        label: "First alignment",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "secondAlignment",
        label: "Second alignment",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "minimumIdentityFraction",
        label: "Minimum identity fraction",
        required: true,
        description: "Matching nongap bases divided by all columns; single-gap columns count as mismatches.",
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "comparedColumns",
        label: "Compared columns",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "matchingColumns",
        label: "Matching columns",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "identityFraction",
        label: "Identity fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "passes",
        label: "Passes",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
