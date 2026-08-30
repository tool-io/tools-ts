import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly upstreamInclusionReads: number;
  readonly downstreamInclusionReads: number;
  readonly skippingReads: number;
  readonly minimumJunctionReads: number;
}>;
export type Output = Readonly<{
  readonly inclusionPairSupported: boolean;
  readonly skippingSupported: boolean;
  readonly cassetteEventSupported: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  [
    input.upstreamInclusionReads,
    input.downstreamInclusionReads,
    input.skippingReads,
  ].forEach((v) => count(v, "skippingReads"));
  count(input.minimumJunctionReads, "minimumJunctionReads", 1);
  const inclusionPairSupported =
      Math.min(input.upstreamInclusionReads, input.downstreamInclusionReads) >=
      input.minimumJunctionReads,
    skippingSupported = input.skippingReads >= input.minimumJunctionReads;
  return {
    inclusionPairSupported,
    skippingSupported,
    cassetteEventSupported: inclusionPairSupported && skippingSupported,
  };
};
export const exampleInput = {
  upstreamInclusionReads: 10,
  downstreamInclusionReads: 8,
  skippingReads: 5,
  minimumJunctionReads: 3,
} satisfies Input;
export const exampleOutput = {
  inclusionPairSupported: true,
  skippingSupported: true,
  cassetteEventSupported: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstreamInclusionReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    downstreamInclusionReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    skippingReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    minimumJunctionReads: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["upstreamInclusionReads", "downstreamInclusionReads", "skippingReads", "minimumJunctionReads"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusionPairSupported: {
      type: "boolean",
    },
    skippingSupported: {
      type: "boolean",
    },
    cassetteEventSupported: {
      type: "boolean",
    },
  },
  required: ["inclusionPairSupported", "skippingSupported", "cassetteEventSupported"],
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
  id: "genomics/cassette-junction-evidence",
  title: "Cassette Junction Evidence",
  description: "Require both cassette inclusion junctions and a direct skipping junction as event evidence.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "upstreamInclusionReads",
        label: "Upstream inclusion reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "downstreamInclusionReads",
        label: "Downstream inclusion reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "skippingReads",
        label: "Skipping reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "minimumJunctionReads",
        label: "Minimum junction reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "inclusionPairSupported",
        label: "Inclusion pair supported",
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "skippingSupported",
        label: "Skipping supported",
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "cassetteEventSupported",
        label: "Cassette event supported",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
