import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, counts } from "../shared.js";

export type Input = Readonly<{
  readonly exonStarts: readonly number[];
  readonly exonEnds: readonly number[];
  readonly junctionStarts: readonly number[];
  readonly junctionEnds: readonly number[];
  readonly junctionReadCounts: readonly number[];
  readonly minimumReadCount: number;
}>;
export type Output = Readonly<{
  readonly supportedIntronCount: number;
  readonly intronCount: number;
  readonly supportedFraction: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const n = input.exonStarts.length;
  if (input.exonEnds.length !== n)
    simpleError("exonEnds", "Exon ends must align with starts.");
  for (let i = 0; i < n; i++) {
    if (input.exonEnds[i] <= input.exonStarts[i])
      simpleError("exonEnds", "Exons must have positive half-open lengths.");
    if (i > 0 && input.exonStarts[i] <= input.exonEnds[i - 1])
      simpleError("exonStarts", "Exons must be ordered and separated by positive introns.");
  }
  if (input.junctionEnds.length !== input.junctionStarts.length)
    simpleError("junctionEnds", "Junction ends must align with starts.");
  if (input.junctionReadCounts.length !== input.junctionStarts.length)
    simpleError("junctionReadCounts", "Read counts must align with junctions.");
  const evidence = new Map<string, number>();
  for (let j = 0; j < input.junctionStarts.length; j++) {
    if (input.junctionEnds[j] <= input.junctionStarts[j])
      simpleError("junctionEnds", "Junctions must have positive half-open lengths.");
    const key = `${input.junctionStarts[j]}:${input.junctionEnds[j]}`;
    const previous = evidence.get(key) ?? 0;
    // Only threshold support is returned; saturating avoids unsafe count addition.
    const remaining = input.minimumReadCount - previous;
    evidence.set(key, previous + Math.min(remaining, input.junctionReadCounts[j]));
  }
  let supportedIntronCount = 0;
  for (let i = 1; i < n; i++) {
    const key = `${input.exonEnds[i - 1]}:${input.exonStarts[i]}`;
    if ((evidence.get(key) ?? 0) >= input.minimumReadCount) supportedIntronCount++;
  }
  return { supportedIntronCount, intronCount: n - 1, supportedFraction: supportedIntronCount / (n - 1) };
};
export const exampleInput = {
  exonStarts: [0, 20, 40],
  exonEnds: [10, 30, 50],
  junctionStarts: [10, 30],
  junctionEnds: [20, 40],
  junctionReadCounts: [8, 1],
  minimumReadCount: 3,
} satisfies Input;
export const exampleOutput = {
  supportedIntronCount: 1,
  intronCount: 2,
  supportedFraction: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exonStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 2,
      maxItems: 100000,
    },
    exonEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 2,
      maxItems: 100000,
    },
    junctionStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
      description: "Zero-based inclusive intron starts, matching the preceding exon end.",
    },
    junctionEnds: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
      description: "Zero-based exclusive intron ends, matching the following exon start.",
    },
    junctionReadCounts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    minimumReadCount: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["exonStarts", "exonEnds", "junctionStarts", "junctionEnds", "junctionReadCounts", "minimumReadCount"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedIntronCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
    intronCount: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    supportedFraction: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["supportedIntronCount", "intronCount", "supportedFraction"],
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
  id: "genomics/gene-model-junction-support",
  title: "Gene Model Junction Support",
  description: "Validate exon-model introns against coordinate-matched observed junction read evidence.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "exonStarts",
        label: "Exon starts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "exonEnds",
        label: "Exon ends",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "junctionStarts",
        label: "Junction starts",
        required: true,
        description: "Zero-based inclusive intron starts, matching the preceding exon end.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "junctionEnds",
        label: "Junction ends",
        required: true,
        description: "Zero-based exclusive intron ends, matching the following exon start.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "junctionReadCounts",
        label: "Junction read counts",
        required: true,
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "minimumReadCount",
        label: "Minimum read count",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "supportedIntronCount",
        label: "Supported intron count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "intronCount",
        label: "Intron count",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "supportedFraction",
        label: "Supported fraction",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
