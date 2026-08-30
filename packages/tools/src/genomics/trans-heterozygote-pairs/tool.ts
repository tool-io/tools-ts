import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { counts } from "../shared.js";

export type Input = Readonly<{
  readonly variantIds: readonly string[];
  readonly geneIds: readonly string[];
  readonly phasedAlternateHaplotypes: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstVariants: readonly string[];
  readonly secondVariants: readonly string[];
  readonly pairGenes: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.variantIds.length;
  counts(input.phasedAlternateHaplotypes, "phasedAlternateHaplotypes", true);
  if (n !== input.geneIds.length)
    simpleError("geneIds", "Genes must align with variants.");
  if (n !== input.phasedAlternateHaplotypes.length)
    simpleError("phasedAlternateHaplotypes", "Known haplotypes must align with variants.");
  if (new Set(input.variantIds).size !== n)
    simpleError("variantIds", "Variant identifiers must be distinct.");
  const firstVariants: string[] = [],
    secondVariants: string[] = [],
    pairGenes: string[] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (
        input.geneIds[i] === input.geneIds[j] &&
        input.phasedAlternateHaplotypes[i] !==
          input.phasedAlternateHaplotypes[j]
      ) {
        firstVariants.push(input.variantIds[i]);
        secondVariants.push(input.variantIds[j]);
        pairGenes.push(input.geneIds[i]);
      }
  return { firstVariants, secondVariants, pairGenes };
};
export const exampleInput = {
  variantIds: ["v1", "v2", "v3"],
  geneIds: ["A", "A", "B"],
  phasedAlternateHaplotypes: [0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  firstVariants: ["v1"],
  secondVariants: ["v2"],
  pairGenes: ["A"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variantIds: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 0,
      maxItems: 400,
    },
    geneIds: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "\\S",
      },
      minItems: 0,
      maxItems: 400,
    },
    phasedAlternateHaplotypes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 1,
      },
      minItems: 0,
      maxItems: 400,
    },
  },
  required: ["variantIds", "geneIds", "phasedAlternateHaplotypes"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVariants: {
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
    secondVariants: {
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
    pairGenes: {
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
  required: ["firstVariants", "secondVariants", "pairGenes"],
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
  id: "genomics/trans-heterozygote-pairs",
  title: "Trans Heterozygote Pairs",
  description: "Find known trans-phased heterozygous variant pairs within each gene; not a pathogenicity classification.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "variantIds",
        label: "Variant ids",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
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
        id: "phasedAlternateHaplotypes",
        label: "Phased alternate haplotypes",
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
        id: "firstVariants",
        label: "First variants",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "secondVariants",
        label: "Second variants",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "pairGenes",
        label: "Pair genes",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
