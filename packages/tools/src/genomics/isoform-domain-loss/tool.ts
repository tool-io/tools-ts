import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly originalDomains: readonly string[];
  readonly switchedDomains: readonly string[];
}>;
export type Output = Readonly<{
  readonly lostDomains: readonly string[];
  readonly retainedDomains: readonly string[];
  readonly domainLoss: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  if (new Set(input.originalDomains).size !== input.originalDomains.length)
    simpleError("originalDomains", "Original domain identifiers must be distinct.");
  if (new Set(input.switchedDomains).size !== input.switchedDomains.length)
    simpleError("switchedDomains", "Switched domain identifiers must be distinct.");
  const kept = new Set(input.switchedDomains);
  const lostDomains = input.originalDomains.filter((v) => !kept.has(v));
  return { lostDomains, retainedDomains: input.originalDomains.filter((v) => kept.has(v)), domainLoss: lostDomains.length > 0 };
};
export const exampleInput = {
  originalDomains: ["kinase", "binding"],
  switchedDomains: ["binding"],
} satisfies Input;
export const exampleOutput = {
  lostDomains: ["kinase"],
  retainedDomains: ["binding"],
  domainLoss: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalDomains: {
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
    switchedDomains: {
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
  required: ["originalDomains", "switchedDomains"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostDomains: {
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
    retainedDomains: {
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
    domainLoss: {
      type: "boolean",
    },
  },
  required: ["lostDomains", "retainedDomains", "domainLoss"],
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
  id: "genomics/isoform-domain-loss",
  title: "Isoform Domain Loss",
  description: "Identify annotated domains lost in a supplied isoform switch.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "originalDomains",
        label: "Original domains",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "switchedDomains",
        label: "Switched domains",
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
        id: "lostDomains",
        label: "Lost domains",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "retainedDomains",
        label: "Retained domains",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "domainLoss",
        label: "Domain loss",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
