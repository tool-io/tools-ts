import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";

export type Input = Readonly<{
  readonly motif: string;
}>;
export type Output = Readonly<{
  readonly primitiveMotif: string;
  readonly primitiveLength: number;
  readonly motifClass: string;
}>;
export const calculate = (input: Input): Output => {
  const m = input.motif.trim().toUpperCase();
  if (!/^[ACGT]+$/.test(m))
    simpleError("motif", "Canonical A/C/G/T DNA is required.");
  // Prefix lengths identify the shortest complete repeat period in linear time.
  const prefix = new Uint32Array(m.length);
  for (let i = 1; i < m.length; i++) {
    let length = prefix[i - 1];
    while (length > 0 && m[i] !== m[length]) length = prefix[length - 1];
    if (m[i] === m[length]) length++;
    prefix[i] = length;
  }
  const period = m.length - prefix[m.length - 1];
  const primitiveMotif = m.length % period === 0 ? m.slice(0, period) : m;
  const primitiveLength = primitiveMotif.length,
    labels = ["", "mono", "di", "tri", "tetra", "penta", "hexa"];
  return {
    primitiveMotif,
    primitiveLength,
    motifClass: primitiveLength <= 6 ? labels[primitiveLength] : "longer",
  };
};
export const exampleInput = { motif: "ATAT" } satisfies Input;
export const exampleOutput = {
  primitiveMotif: "AT",
  primitiveLength: 2,
  motifClass: "di",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    motif: {
      type: "string",
      minLength: 1,
      maxLength: 1000000,
      pattern: "^\\s*[ACGTacgt]+\\s*$",
    },
  },
  required: ["motif"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primitiveMotif: {
      type: "string",
      maxLength: 1000000,
    },
    primitiveLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    motifClass: {
      type: "string",
      enum: ["mono", "di", "tri", "tetra", "penta", "hexa", "longer"],
    },
  },
  required: ["primitiveMotif", "primitiveLength", "motifClass"],
} as const satisfies ToolJsonSchema;

const isInput = (value: unknown): value is Input =>
  matchesToolJsonSchema(value, inputSchema);

export const run = (input: unknown): ToolResult<Output> => {
  if (!isInput(input)) {
    if (typeof input !== "object" || input === null || Array.isArray(input))
      return invalidInput([
        { code: "object_required", field: "", message: "Input must be an object." },
      ]);
    const fields = new Map<string, unknown>(Object.entries(input));
    const unknownFields = [...fields.keys()].filter(
      (field) => !Object.hasOwn(inputSchema.properties, field),
    );
    if (unknownFields.length)
      return invalidInput(
        unknownFields.map((field) => ({
          code: "unknown_field",
          field,
          message: `${field} is not a supported input field.`,
        })),
      );
    for (const [field, fieldSchema] of Object.entries(inputSchema.properties))
      if (!matchesToolJsonSchema(fields.get(field), fieldSchema))
        return invalidInput([
          { code: "invalid_field", field, message: `${field} is invalid.` },
        ]);
    return invalidInput([
      { code: "invalid_field", field: "", message: "Input does not match the tool schema." },
    ]);
  }
  try {
    const output = calculate(input);
    if (!matchesToolJsonSchema(output, outputSchema))
      throw new Error("Calculation produced output outside its declared schema.");
    return toolSuccess(output);
  } catch (error) {
    if (!(error instanceof SimpleToolError)) throw error;
    return invalidInput([
      { code: error.code, field: error.field, message: error.message },
    ]);
  }
};

export const tool = defineTool<Input, Output>({
  contractVersion: 1,
  id: "genomics/ssr-motif-class",
  title: "SSR Motif Class",
  description: "Reduce an SSR motif to its primitive repeat unit and classify its base length.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "motif",
        label: "Motif",
        required: true,
        valueType: {
          type: "string",
        },
      },
    ],
    outputs: [
      {
        id: "primitiveMotif",
        label: "Primitive motif",
        valueType: {
          type: "string",
        },
      },
      {
        id: "primitiveLength",
        label: "Primitive length",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "motifClass",
        label: "Motif class",
        valueType: {
          type: "string",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
