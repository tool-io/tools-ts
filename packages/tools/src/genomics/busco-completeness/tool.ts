import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, positive } from "../shared.js";

export type Input = Readonly<{
  readonly singleCopyComplete: number;
  readonly duplicatedComplete: number;
  readonly fragmented: number;
  readonly missing: number;
}>;
export type Output = Readonly<{
  readonly completePercent: number;
  readonly singleCopyPercent: number;
  readonly totalOrthologs: number;
}>;
// https://busco.ezlab.org/busco_userguide.html (Interpreting the results)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const totalOrthologs = input.singleCopyComplete + input.duplicatedComplete + input.fragmented + input.missing;
  if (!Number.isSafeInteger(totalOrthologs))
    simpleError("singleCopyComplete", "Total ortholog count exceeds the safe integer range.", "count_overflow");
  positive(totalOrthologs, "singleCopyComplete");
  return {
    completePercent: (100 * (input.singleCopyComplete + input.duplicatedComplete)) / totalOrthologs,
    singleCopyPercent: (100 * input.singleCopyComplete) / totalOrthologs,
    totalOrthologs,
  };
};
export const exampleInput = {
  singleCopyComplete: 80,
  duplicatedComplete: 10,
  fragmented: 5,
  missing: 5,
} satisfies Input;
export const exampleOutput = {
  completePercent: 90,
  singleCopyPercent: 80,
  totalOrthologs: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    singleCopyComplete: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    duplicatedComplete: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    fragmented: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    missing: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["singleCopyComplete", "duplicatedComplete", "fragmented", "missing"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completePercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    singleCopyPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    totalOrthologs: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["completePercent", "singleCopyPercent", "totalOrthologs"],
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
  id: "genomics/busco-completeness",
  title: "BUSCO Completeness",
  description: "Calculate complete and single-copy completeness from exclusive BUSCO-style category counts.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "singleCopyComplete",
        label: "Single copy complete",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "duplicatedComplete",
        label: "Duplicated complete",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "fragmented",
        label: "Fragmented",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "missing",
        label: "Missing",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "completePercent",
        label: "Complete percent",
        valueType: {
          type: "number",
        },
      },
      {
        id: "singleCopyPercent",
        label: "Single copy percent",
        valueType: {
          type: "number",
        },
      },
      {
        id: "totalOrthologs",
        label: "Total orthologs",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
