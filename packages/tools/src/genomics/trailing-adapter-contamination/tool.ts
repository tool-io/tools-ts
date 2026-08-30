import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly readSequences: readonly string[];
  readonly adapterSequence: string;
  readonly minimumMatchBases: number;
}>;
export type Output = Readonly<{
  readonly contaminatedReadIndexes: readonly number[];
  readonly trailingAdapterBases: readonly number[];
  readonly contaminatedReadPercent: number;
}>;
export const calculate = (input: Input): Output => {
  validateInput(input);
  const adapter = input.adapterSequence.trim().toUpperCase();
  if (input.minimumMatchBases > adapter.length)
    simpleError("minimumMatchBases", "Minimum match cannot exceed adapter length.");
  const totalCharacters = input.readSequences.reduce((sum, v) => sum + v.length, adapter.length);
  if (totalCharacters > 10000000)
    simpleError("readSequences", "Adapter scan is limited to 10000000 input characters.", "resource_limit_exceeded");
  // Prefix failure links permit an exact terminal-prefix match in linear time.
  const failure = new Array<number>(adapter.length).fill(0);
  for (let i = 1, matched = 0; i < adapter.length; i++) {
    while (matched > 0 && adapter[i] !== adapter[matched]) matched = failure[matched - 1];
    if (adapter[i] === adapter[matched]) matched++;
    failure[i] = matched;
  }
  const contaminatedReadIndexes: number[] = [];
  const trailingAdapterBases = input.readSequences.map((value, index) => {
    const read = value.trim().toUpperCase();
    let matched = 0;
    for (let i = 0; i < read.length; i++) {
      while (matched > 0 && (matched === adapter.length || read[i] !== adapter[matched])) matched = failure[matched - 1];
      if (read[i] === adapter[matched]) matched++;
    }
    const length = matched >= input.minimumMatchBases ? matched : 0;
    if (length > 0) contaminatedReadIndexes.push(index);
    return length;
  });
  return { contaminatedReadIndexes, trailingAdapterBases, contaminatedReadPercent: (100 * contaminatedReadIndexes.length) / input.readSequences.length };
};
export const exampleInput = {
  readSequences: ["ACGTAAA", "ACGT"],
  adapterSequence: "AAA",
  minimumMatchBases: 3,
} satisfies Input;
export const exampleOutput = {
  contaminatedReadIndexes: [0],
  trailingAdapterBases: [3, 0],
  contaminatedReadPercent: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readSequences: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 1000000,
        pattern: "^\\s*[ACGTacgt]+\\s*$",
      },
      minItems: 1,
      maxItems: 100000,
      description: "Canonical DNA reads, limited with the adapter to 10000000 input characters.",
    },
    adapterSequence: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
    minimumMatchBases: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["readSequences", "adapterSequence", "minimumMatchBases"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contaminatedReadIndexes: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
    },
    trailingAdapterBases: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 1,
      maxItems: 100000,
    },
    contaminatedReadPercent: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
  },
  required: ["contaminatedReadIndexes", "trailingAdapterBases", "contaminatedReadPercent"],
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
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const fields = new Map<string, unknown>(Object.entries(value as Record<string, unknown>));
    const reads = fields.get("readSequences"), adapter = fields.get("adapterSequence");
    let characters = typeof adapter === "string" ? adapter.length : 0;
    if (Array.isArray(reads)) {
      for (const read of reads) {
        if (typeof read === "string") characters += read.length;
        if (characters > 10000000)
          simpleError("readSequences", "Adapter scan is limited to 10000000 input characters.", "resource_limit_exceeded");
      }
    }
  }
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
  id: "genomics/trailing-adapter-contamination",
  title: "Trailing Adapter Contamination",
  description: "Detect read-terminal matches to an adapter prefix above the chosen minimum match length.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "readSequences",
        label: "Read sequences",
        required: true,
        description: "Canonical DNA reads, limited with the adapter to 10000000 input characters.",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "adapterSequence",
        label: "Adapter sequence",
        required: true,
        valueType: {
          type: "string",
        },
      },
      {
        id: "minimumMatchBases",
        label: "Minimum match bases",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "contaminatedReadIndexes",
        label: "Contaminated read indexes",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "trailingAdapterBases",
        label: "Trailing adapter bases",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "contaminatedReadPercent",
        label: "Contaminated read percent",
        valueType: {
          type: "number",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
