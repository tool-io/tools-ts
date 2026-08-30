import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { dna, reverseDNA } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly strand: string;
  readonly frame: number;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly codingBases: number;
  readonly aminoAcidCount: number;
}>;
// https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi (standard genetic code)
export const calculate = (input: Input): Output => {
  validateInput(input);
  const original = dna(input.sequence),
    strands = [original, reverseDNA(original)];
  let bestLength = 0,
    startIndex = -1,
    endIndex = -1,
    frame = -1,
    strand = "none";
  for (let st = 0; st < 2; st++) {
    const s = strands[st];
    for (let f = 0; f < 3; f++) {
      let start = -1;
      for (let i = f; i + 3 <= s.length; i += 3) {
        const codon = s.slice(i, i + 3);
        if (start < 0 && codon === "ATG") start = i;
        if (["TAA", "TAG", "TGA"].includes(codon)) {
          if (start >= 0 && i - start > bestLength) {
            bestLength = i - start;
            startIndex = st === 0 ? start : s.length - i - 3;
            endIndex = st === 0 ? i + 3 : s.length - start;
            frame = f;
            strand = st === 0 ? "forward" : "reverse";
          }
          start = -1;
        }
      }
    }
  }
  return {
    strand,
    frame,
    startIndex,
    endIndex,
    codingBases: bestLength,
    aminoAcidCount: bestLength / 3,
  };
};
export const exampleInput = { sequence: "TTATTTCAT" } satisfies Input;
export const exampleOutput = {
  strand: "reverse",
  frame: 0,
  startIndex: 0,
  endIndex: 9,
  codingBases: 6,
  aminoAcidCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequence: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
  },
  required: ["sequence"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strand: {
      type: "string",
      enum: ["forward", "reverse", "none"],
    },
    frame: {
      type: "integer",
      minimum: -1,
      maximum: 2,
      description: "Frame offset 0, 1, or 2 on the selected strand; -1 if absent. Equal lengths choose forward before reverse, then lower frame, then earlier start on that strand.",
    },
    startIndex: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
      description: "Zero-based inclusive coordinate in the trimmed original sequence; -1 if absent.",
    },
    endIndex: {
      type: "integer",
      minimum: -1,
      maximum: 9007199254740991,
      description: "Zero-based exclusive coordinate including the stop codon in the original sequence; -1 if absent.",
    },
    codingBases: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Bases from ATG through the last sense codon; excludes the terminal stop codon.",
    },
    aminoAcidCount: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
    },
  },
  required: ["strand", "frame", "startIndex", "endIndex", "codingBases", "aminoAcidCount"],
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
  id: "genomics/six-frame-orf-scan",
  title: "Six Frame ORF Scan",
  description: "Find the longest complete ATG-to-stop ORF across six frames using the standard genetic code, with original-strand half-open coordinates including the stop.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sequence",
        label: "Sequence",
        required: true,
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "strand",
        label: "Strand",
        valueType: {
          type: "string",
        },
      },
      {
        id: "frame",
        label: "Frame",
        description: "Frame offset 0, 1, or 2 on the selected strand; -1 if absent. Equal lengths choose forward before reverse, then lower frame, then earlier start on that strand.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "startIndex",
        label: "Start index",
        description: "Zero-based inclusive coordinate in the trimmed original sequence; -1 if absent.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "endIndex",
        label: "End index",
        description: "Zero-based exclusive coordinate including the stop codon in the original sequence; -1 if absent.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "codingBases",
        label: "Coding bases",
        description: "Bases from ATG through the last sense codon; excludes the terminal stop codon.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "aminoAcidCount",
        label: "Amino acid count",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
