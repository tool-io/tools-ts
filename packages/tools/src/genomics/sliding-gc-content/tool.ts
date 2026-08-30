import { matchesToolJsonSchema } from "../../core/contract.js";
import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";
import type { ToolExample } from "../../core/example.js";
import { count, dna } from "../shared.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly windowLength: number;
  readonly stepLength: number;
}>;
export type Output = Readonly<{
  readonly windowStarts: readonly number[];
  readonly gcPercent: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = dna(input.sequence);
  count(input.windowLength, "windowLength", 1);
  count(input.stepLength, "stepLength", 1);
  if (input.windowLength > s.length)
    simpleError("windowLength", "Window must fit within the sequence.");
  if (
    Math.floor((s.length - input.windowLength) / input.stepLength) + 1 >
    100000
  )
    simpleError("stepLength", "Output is limited to 100000 windows.");
  const windowStarts: number[] = [],
    gcPercent: number[] = [];
  const cumulativeGc = new Array<number>(s.length + 1).fill(0);
  for (let i = 0; i < s.length; i++)
    cumulativeGc[i + 1] =
      cumulativeGc[i] + Number(s[i] === "G" || s[i] === "C");
  for (let i = 0; i + input.windowLength <= s.length; i += input.stepLength) {
    windowStarts.push(i);
    gcPercent.push(
      (100 * (cumulativeGc[i + input.windowLength] - cumulativeGc[i])) /
        input.windowLength,
    );
  }
  return { windowStarts, gcPercent };
};
export const exampleInput = {
  sequence: "GGCCAAAA",
  windowLength: 4,
  stepLength: 4,
} satisfies Input;
export const exampleOutput = {
  windowStarts: [0, 4],
  gcPercent: [100, 0],
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
    windowLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
    stepLength: {
      type: "integer",
      minimum: 1,
      maximum: 9007199254740991,
    },
  },
  required: ["sequence", "windowLength", "stepLength"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    windowStarts: {
      type: "array",
      items: {
        type: "integer",
        minimum: 0,
        maximum: 9007199254740991,
      },
      minItems: 0,
      maxItems: 100000,
      description: "Zero-based start offsets of complete windows in the trimmed sequence.",
    },
    gcPercent: {
      type: "array",
      items: {
        type: "number",
        minimum: 0,
        maximum: 100,
      },
      minItems: 0,
      maxItems: 100000,
    },
  },
  required: ["windowStarts", "gcPercent"],
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
  id: "genomics/sliding-gc-content",
  title: "Sliding GC Content",
  description: "Calculate GC content in complete DNA windows at a chosen step size.",
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
      {
        id: "windowLength",
        label: "Window length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
      {
        id: "stepLength",
        label: "Step length",
        required: true,
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "windowStarts",
        label: "Window starts",
        description: "Zero-based start offsets of complete windows in the trimmed sequence.",
        valueType: {
          type: "list",
          items: {
            type: "integer",
          },
        },
      },
      {
        id: "gcPercent",
        label: "GC percent",
        valueType: {
          type: "list",
          items: {
            type: "number",
          },
        },
      },
    ],
  },
  execute: run,
});
export default tool;
