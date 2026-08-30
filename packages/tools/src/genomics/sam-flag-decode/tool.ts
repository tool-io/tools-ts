import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly flag: number;
}>;
export type Output = Readonly<{
  readonly enabledFlags: readonly string[];
  readonly unknownBits: number;
}>;
// https://samtools.github.io/hts-specs/SAMv1.pdf (section 1.4, FLAG)
export const calculate = (input: Input): Output => {
  count(input.flag, "flag");
  if (input.flag > 65535)
    simpleError("flag", "SAM FLAG must fit within an unsigned 16-bit integer.");
  const definitions: [[number, string], ...Array<[number, string]>] = [
    [1, "paired"],
    [2, "proper-pair"],
    [4, "unmapped"],
    [8, "mate-unmapped"],
    [16, "reverse"],
    [32, "mate-reverse"],
    [64, "first-segment"],
    [128, "last-segment"],
    [256, "secondary"],
    [512, "qc-fail"],
    [1024, "duplicate"],
    [2048, "supplementary"],
  ];
  return {
    enabledFlags: definitions
      .filter(([bit]) => (input.flag & bit) !== 0)
      .map(([, label]) => label),
    unknownBits: input.flag & ~4095,
  };
};
export const exampleInput = { flag: 99 } satisfies Input;
export const exampleOutput = {
  enabledFlags: ["paired", "proper-pair", "mate-reverse", "first-segment"],
  unknownBits: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flag: {
      type: "integer",
      minimum: 0,
      maximum: 65535,
    },
  },
  required: ["flag"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabledFlags: {
      type: "array",
      items: {
        type: "string",
        maxLength: 1000000,
      },
      minItems: 0,
      maxItems: 12,
    },
    unknownBits: {
      type: "integer",
      minimum: 0,
      maximum: 65535,
    },
  },
  required: ["enabledFlags", "unknownBits"],
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
  id: "genomics/sam-flag-decode",
  title: "SAM Flag Decode",
  description: "Decode SAM FLAG bits and preserve unsupported high bits explicitly.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "flag",
        label: "Flag",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "enabledFlags",
        label: "Enabled flags",
        valueType: {
          type: "list",
          items: {
            type: "string",
          },
        },
      },
      {
        id: "unknownBits",
        label: "Unknown bits",
        valueType: {
          type: "integer",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
