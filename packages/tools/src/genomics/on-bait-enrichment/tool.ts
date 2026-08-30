import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly onBaitReads: number;
  readonly totalMappedReads: number;
  readonly baitBases: number;
  readonly genomeBases: number;
}>;
export type Output = Readonly<{
  readonly observedOnBaitFraction: number;
  readonly expectedGenomicFraction: number;
  readonly enrichmentFold: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  count(input.onBaitReads, "onBaitReads");
  count(input.totalMappedReads, "totalMappedReads", 1);
  count(input.baitBases, "baitBases", 1);
  count(input.genomeBases, "genomeBases", 1);
  if (input.onBaitReads > input.totalMappedReads)
    simpleError("onBaitReads", "On-bait reads cannot exceed mapped reads.");
  if (input.baitBases > input.genomeBases)
    simpleError("baitBases", "Bait bases cannot exceed genome bases.");
  const observedOnBaitFraction = input.onBaitReads / input.totalMappedReads,
    expectedGenomicFraction = input.baitBases / input.genomeBases;
  return {
    observedOnBaitFraction,
    expectedGenomicFraction,
    enrichmentFold: observedOnBaitFraction / expectedGenomicFraction,
  };
};
export const exampleInput = {
  onBaitReads: 800,
  totalMappedReads: 1000,
  baitBases: 100,
  genomeBases: 1000,
} satisfies Input;
export const exampleOutput = {
  observedOnBaitFraction: 0.8,
  expectedGenomicFraction: 0.1,
  enrichmentFold: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onBaitReads: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    totalMappedReads: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    baitBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    genomeBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["onBaitReads", "totalMappedReads", "baitBases", "genomeBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedOnBaitFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    expectedGenomicFraction: {
      type: "number",
      exclusiveMinimum: 0,
      maximum: 1,
    },
    enrichmentFold: {
      type: "number",
      minimum: 0,
      description: "Observed on-bait read fraction divided by the genomic bait fraction; reads, rather than aligned base counts, are used.",
    },
  },
  required: ["observedOnBaitFraction", "expectedGenomicFraction", "enrichmentFold"],
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
  id: "genomics/on-bait-enrichment",
  title: "On Bait Enrichment",
  description: "Estimate target enrichment relative to the genomic fraction covered by baits.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "onBaitReads",
        label: "On bait reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "totalMappedReads",
        label: "Total mapped reads",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "baitBases",
        label: "Bait bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "genomeBases",
        label: "Genome bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "observedOnBaitFraction",
        label: "Observed on bait fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "expectedGenomicFraction",
        label: "Expected genomic fraction",
        valueType: {
          type: "number",
        },
      },
      {
        id: "enrichmentFold",
        label: "Enrichment fold",
        description: "Observed on-bait read fraction divided by the genomic bait fraction; reads, rather than aligned base counts, are used.",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
