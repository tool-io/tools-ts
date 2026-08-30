import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly gff3: string;
}>;
export type Output = Readonly<{
  readonly featureTypes: readonly string[];
  readonly featureCounts: readonly number[];
  readonly recordCount: number;
}>;
// https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md
export const calculate = (input: Input): Output => {
  validateInput(input);
  const tally = new Map<string, number>();
  for (const line of input.gff3.split(/\r?\n/)) {
    if (line === "##FASTA") break;
    if (!line.trim() || line.startsWith("#")) continue;
    const fields = line.split("\t");
    const start = Number(fields[3]), end = Number(fields[4]);
    if (fields.length !== 9 || !fields[0].trim() || !fields[2].trim() || fields[2] === "." || !/^[0-9]+$/.test(fields[3]) || !/^[0-9]+$/.test(fields[4]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || end < start)
      simpleError("gff3", "Features require nine fields, a type, and safe positive 1-based coordinates.");
    if (!["+", "-", ".", "?"].includes(fields[6]) || !["0", "1", "2", "."].includes(fields[7]) || (fields[2] === "CDS" && fields[7] === "."))
      simpleError("gff3", "Feature strand and phase must follow GFF3; CDS requires phase 0, 1, or 2.");
    if (fields[5] !== "." && (!/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/.test(fields[5]) || !Number.isFinite(Number(fields[5]))))
      simpleError("gff3", "Feature scores must be finite numbers or a dot.");
    tally.set(fields[2], (tally.get(fields[2]) ?? 0) + 1);
  }
  const entries = [...tally.entries()].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  const featureTypes = entries.map(([type]) => type);
  const featureCounts = entries.map(([, count]) => count);
  return { featureTypes, featureCounts, recordCount: featureCounts.reduce((a, b) => a + b, 0) };
};
export const exampleInput = {
  gff3: "##gff-version 3\nchr1\tx\tgene\t1\t10\t.\t+\t.\tID=g1\nchr1\tx\texon\t1\t5\t.\t+\t.\tParent=g1\n",
} satisfies Input;
export const exampleOutput = {
  featureTypes: ["exon", "gene"],
  featureCounts: [1, 1],
  recordCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gff3: {
      type: "string",
      maxLength: 1000000,
      description: "GFF3 feature records or a document. Counts records, including repeated IDs; stops at ##FASTA. Does not validate ontology or parent relationships.",
    },
  },
  required: ["gff3"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureTypes: {
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
    featureCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 1,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    recordCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["featureTypes", "featureCounts", "recordCount"],
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
  id: "genomics/gff3-feature-tally",
  title: "GFF3 Feature Tally",
  description: "Tally GFF3 feature types while respecting comments and the embedded FASTA boundary.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "gff3",
        label: "Gff 3",
        required: true,
        description: "GFF3 feature records or a document. Counts records, including repeated IDs; stops at ##FASTA. Does not validate ontology or parent relationships.",
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "featureTypes",
        label: "Feature types",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "featureCounts",
        label: "Feature counts",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "recordCount",
        label: "Record count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
