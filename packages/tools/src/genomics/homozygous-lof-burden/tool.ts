import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly alternateAlleleCounts: readonly number[];
  readonly lossOfFunctionFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly burdenGenes: readonly string[];
  readonly homozygousLofCounts: readonly number[];
  readonly totalHomozygousLof: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.geneIds.length;
  counts(input.alternateAlleleCounts, "alternateAlleleCounts");
  counts(input.lossOfFunctionFlags, "lossOfFunctionFlags");
  if (n !== input.alternateAlleleCounts.length)
    simpleError("alternateAlleleCounts", "Diploid dosages must align with genes.");
  if (n !== input.lossOfFunctionFlags.length)
    simpleError("lossOfFunctionFlags", "LoF flags must align with genes.");
  const tally = new Map<string, number>();
  for (let i = 0; i < n; i++)
    if (
      input.alternateAlleleCounts[i] === 2 &&
      input.lossOfFunctionFlags[i] === 1
    )
      tally.set(input.geneIds[i], (tally.get(input.geneIds[i]) ?? 0) + 1);
  const entries = [...tally.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const burdenGenes = entries.map(([gene]) => gene);
  const homozygousLofCounts = entries.map(([, count]) => count);
  return {
    burdenGenes,
    homozygousLofCounts,
    totalHomozygousLof: homozygousLofCounts.reduce((a, b) => a + b, 0),
  };
};
export const exampleInput = {
  geneIds: ["A", "A", "B"],
  alternateAlleleCounts: [2, 1, 2],
  lossOfFunctionFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  burdenGenes: ["A"],
  homozygousLofCounts: [1],
  totalHomozygousLof: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    geneIds: {
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
    alternateAlleleCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 2,
      },
      minItems: 1,
      maxItems: 100000,
    },
    lossOfFunctionFlags: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 1,
      },
      minItems: 1,
      maxItems: 100000,
    },
  },
  required: ["geneIds", "alternateAlleleCounts", "lossOfFunctionFlags"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    burdenGenes: {
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
    homozygousLofCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    totalHomozygousLof: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["burdenGenes", "homozygousLofCounts", "totalHomozygousLof"],
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
  id: "genomics/homozygous-lof-burden",
  title: "Homozygous LOF Burden",
  description: "Tally caller-annotated homozygous loss-of-function variants per gene.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "geneIds",
        label: "Gene ids",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "alternateAlleleCounts",
        label: "Alternate allele counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "lossOfFunctionFlags",
        label: "Loss of function flags",
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
        id: "burdenGenes",
        label: "Burden genes",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "homozygousLofCounts",
        label: "Homozygous lof counts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "totalHomozygousLof",
        label: "Total homozygous lof",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
