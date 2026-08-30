import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, counts } from "../shared.js";

export type Input = Readonly<{
  readonly snpPositions: readonly number[];
  readonly windowBp: number;
  readonly minimumSnps: number;
}>;
export type Output = Readonly<{
  readonly clusterStarts: readonly number[];
  readonly clusterEnds: readonly number[];
  readonly clusterCounts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  counts(input.snpPositions, "snpPositions");
  count(input.windowBp, "windowBp", 1);
  count(input.minimumSnps, "minimumSnps", 1);
  if (input.snpPositions.some((v) => input.windowBp > Number.MAX_SAFE_INTEGER - v))
    simpleError("windowBp", "Window ends exceed the safe coordinate range.", "coordinate_overflow");
  const positions = [...new Set(input.snpPositions)].sort((a, b) => a - b),
    clusterStarts: number[] = [],
    clusterEnds: number[] = [],
    clusterCounts: number[] = [];
  let right = 0;
  for (let left = 0; left < positions.length; left++) {
    right = Math.max(right, left);
    while (
      right < positions.length &&
      positions[right] < positions[left] + input.windowBp
    )
      right++;
    if (right - left >= input.minimumSnps) {
      clusterStarts.push(positions[left]);
      clusterEnds.push(positions[left] + input.windowBp);
      clusterCounts.push(right - left);
    }
  }
  return { clusterStarts, clusterEnds, clusterCounts };
};
export const exampleInput = {
  snpPositions: [1, 2, 3, 20],
  windowBp: 5,
  minimumSnps: 3,
} satisfies Input;
export const exampleOutput = {
  clusterStarts: [1],
  clusterEnds: [6],
  clusterCounts: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snpPositions: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
      description: "Zero-based SNP coordinates. Duplicates are counted once; each distinct SNP anchors a half-open window.",
    },
    windowBp: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    minimumSnps: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["snpPositions", "windowBp", "minimumSnps"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    clusterEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    clusterCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["clusterStarts", "clusterEnds", "clusterCounts"],
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
  id: "genomics/localized-snp-density",
  title: "Localized SNP Density",
  description: "Find SNP-anchored half-open windows meeting a caller-defined localized density threshold.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "snpPositions",
        label: "Snp positions",
        required: true,
        description: "Zero-based SNP coordinates. Duplicates are counted once; each distinct SNP anchors a half-open window.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "windowBp",
        label: "Window bp",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "minimumSnps",
        label: "Minimum snps",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "clusterStarts",
        label: "Cluster starts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "clusterEnds",
        label: "Cluster ends",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "clusterCounts",
        label: "Cluster counts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
