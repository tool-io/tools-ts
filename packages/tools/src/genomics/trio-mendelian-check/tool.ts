import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly motherGenotypes: readonly string[];
  readonly fatherGenotypes: readonly string[];
  readonly childGenotypes: readonly string[];
}>;
export type Output = Readonly<{
  readonly violationIndexes: readonly number[];
  readonly denovoCandidateIndexes: readonly number[];
  readonly consistentCount: number;
}>;
// https://samtools.github.io/hts-specs/VCFv4.5.pdf (GT allele indexes)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.childGenotypes.length;
  if (input.motherGenotypes.length !== n)
    simpleError("motherGenotypes", "Maternal genotypes must align with child genotypes.");
  if (input.fatherGenotypes.length !== n)
    simpleError("fatherGenotypes", "Paternal genotypes must align with child genotypes.");
  // Allele indexes are decimal labels. Canonicalize zeros without lossy Number conversion.
  const parse = (value: string): readonly string[] => value.split(/[|/]/).map((allele) => allele.replace(/^0+(?=\d)/, ""));
  const violationIndexes: number[] = [], denovoCandidateIndexes: number[] = [];
  for (let i = 0; i < n; i++) {
    const mother = parse(input.motherGenotypes[i]);
    const father = parse(input.fatherGenotypes[i]);
    const child = parse(input.childGenotypes[i]);
    const possible = (mother.includes(child[0]) && father.includes(child[1])) || (mother.includes(child[1]) && father.includes(child[0]));
    if (!possible) violationIndexes.push(i);
    if (child.some((v) => v !== "0" && !mother.includes(v) && !father.includes(v))) denovoCandidateIndexes.push(i);
  }
  return { violationIndexes, denovoCandidateIndexes, consistentCount: n - violationIndexes.length };
};
export const exampleInput = {
  motherGenotypes: ["0/0", "0/1"],
  fatherGenotypes: ["0/0", "0/0"],
  childGenotypes: ["0/1", "0/1"],
} satisfies Input;
export const exampleOutput = {
  violationIndexes: [0],
  denovoCandidateIndexes: [0],
  consistentCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    motherGenotypes: {
      type: "array",
      items: {
        type: "string",
        maxLength: 1000000,
        minLength: 3,
        pattern: "^[0-9]+[|/][0-9]+(?![\\s\\S])",
      },
      minItems: 1,
      maxItems: 100000,
    },
    fatherGenotypes: {
      type: "array",
      items: {
        type: "string",
        maxLength: 1000000,
        minLength: 3,
        pattern: "^[0-9]+[|/][0-9]+(?![\\s\\S])",
      },
      minItems: 1,
      maxItems: 100000,
    },
    childGenotypes: {
      type: "array",
      items: {
        type: "string",
        maxLength: 1000000,
        minLength: 3,
        pattern: "^[0-9]+[|/][0-9]+(?![\\s\\S])",
      },
      minItems: 1,
      maxItems: 100000,
      description: "Called diploid VCF allele indexes separated by / or |; missing calls are invalid. Phase is ignored for inheritance.",
    },
  },
  required: ["motherGenotypes", "fatherGenotypes", "childGenotypes"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    violationIndexes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    denovoCandidateIndexes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    consistentCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["violationIndexes", "denovoCandidateIndexes", "consistentCount"],
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
  id: "genomics/trio-mendelian-check",
  title: "Trio Mendelian Check",
  description: "Check diploid trio Mendelian inheritance and identify absent-parent alternate allele candidates.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "motherGenotypes",
        label: "Mother genotypes",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "fatherGenotypes",
        label: "Father genotypes",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "childGenotypes",
        label: "Child genotypes",
        required: true,
        description: "Called diploid VCF allele indexes separated by / or |; missing calls are invalid. Phase is ignored for inheritance.",
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
        id: "violationIndexes",
        label: "Violation indexes",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "denovoCandidateIndexes",
        label: "Denovo candidate indexes",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "consistentCount",
        label: "Consistent count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
