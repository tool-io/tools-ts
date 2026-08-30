import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { fraction, counts } from "../shared.js";

export type Input = Readonly<{
  readonly instabilityFlags: readonly number[];
  readonly minimumUnstableFraction: number;
}>;
export type Output = Readonly<{
  readonly unstableLoci: number;
  readonly testedLoci: number;
  readonly unstablePercent: number;
  readonly exceedsThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.instabilityFlags, "instabilityFlags");
  if (input.instabilityFlags.some((v) => v !== 0 && v !== 1))
    simpleError("instabilityFlags", "Use zero or one per tested locus.");
  fraction(input.minimumUnstableFraction, "minimumUnstableFraction");
  const unstableLoci = input.instabilityFlags.reduce((a, b) => a + b, 0),
    testedLoci = input.instabilityFlags.length;
  return {
    unstableLoci,
    testedLoci,
    unstablePercent: (100 * unstableLoci) / testedLoci,
    exceedsThreshold:
      unstableLoci / testedLoci >= input.minimumUnstableFraction,
  };
};
export const exampleInput = {
  instabilityFlags: [1, 0, 1, 0],
  minimumUnstableFraction: 0.3,
} satisfies Input;
export const exampleOutput = {
  unstableLoci: 2,
  testedLoci: 4,
  unstablePercent: 50,
  exceedsThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instabilityFlags: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
    minimumUnstableFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["instabilityFlags", "minimumUnstableFraction"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unstableLoci: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    testedLoci: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    unstablePercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    exceedsThreshold: {
      type: "boolean",
      description: "True when the unstable fraction is at least the supplied threshold.",
    },
  },
  required: ["unstableLoci", "testedLoci", "unstablePercent", "exceedsThreshold"],
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
  id: "genomics/msi-locus-instability",
  title: "MSI Locus Instability",
  description: "Quantify unstable microsatellite loci using supplied assay flags and threshold.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "instabilityFlags",
        label: "Instability flags",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumUnstableFraction",
        label: "Minimum unstable fraction",
        required: true,
        valueType: {
          type: "number",
        },
      },
    ],
    outputs: [
      {
        id: "unstableLoci",
        label: "Unstable loci",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "testedLoci",
        label: "Tested loci",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "unstablePercent",
        label: "Unstable percent",
        valueType: {
          type: "number",
        },
      },
      {
        id: "exceedsThreshold",
        label: "Exceeds threshold",
        description: "True when the unstable fraction is at least the supplied threshold.",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
