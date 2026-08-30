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
  readonly firstReverse: boolean;
  readonly secondReverse: boolean;
  readonly firstPosition: number;
  readonly secondPosition: number;
}>;
export type Output = Readonly<{
  readonly leftRightOrientation: string;
  readonly inwardFacing: boolean;
}>;
export const calculate = (input: Input): Output => {
  count(input.firstPosition, "firstPosition");
  count(input.secondPosition, "secondPosition");
  if (input.firstPosition === input.secondPosition)
    simpleError("secondPosition", "Different ordered read starts required.");
  const first = input.firstReverse ? "R" : "F",
    second = input.secondReverse ? "R" : "F",
    leftRightOrientation =
      input.firstPosition < input.secondPosition
        ? first + second
        : second + first;
  return { leftRightOrientation, inwardFacing: leftRightOrientation === "FR" };
};
export const exampleInput = {
  firstReverse: false,
  secondReverse: true,
  firstPosition: 100,
  secondPosition: 200,
} satisfies Input;
export const exampleOutput = {
  leftRightOrientation: "FR",
  inwardFacing: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstReverse: {
      type: "boolean",
    },
    secondReverse: {
      type: "boolean",
    },
    firstPosition: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Zero-based leftmost alignment start of a mapped read on the same reference as its mate.",
    },
    secondPosition: {
      type: "integer",
      minimum: 0,
      maximum: 9007199254740991,
      description: "Zero-based leftmost alignment start of the mapped mate; starts must differ.",
    },
  },
  required: ["firstReverse", "secondReverse", "firstPosition", "secondPosition"],
} as const satisfies ToolJsonSchema;

export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftRightOrientation: {
      type: "string",
      enum: ["FF", "FR", "RF", "RR"],
    },
    inwardFacing: {
      type: "boolean",
    },
  },
  required: ["leftRightOrientation", "inwardFacing"],
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
  id: "genomics/read-pair-orientation",
  title: "Read Pair Orientation",
  description: "Classify mapped read strands on the same reference after ordering their distinct leftmost alignment starts.",
  execution: { kind: "pure" },
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "firstReverse",
        label: "First reverse",
        required: true,
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "secondReverse",
        label: "Second reverse",
        required: true,
        valueType: {
          type: "boolean",
        },
      },
      {
        id: "firstPosition",
        label: "First position",
        required: true,
        description: "Zero-based leftmost alignment start of a mapped read on the same reference as its mate.",
        valueType: {
          type: "integer",
        },
      },
      {
        id: "secondPosition",
        label: "Second position",
        required: true,
        description: "Zero-based leftmost alignment start of the mapped mate; starts must differ.",
        valueType: {
          type: "integer",
        },
      },
    ],
    outputs: [
      {
        id: "leftRightOrientation",
        label: "Left right orientation",
        valueType: {
          type: "string",
        },
      },
      {
        id: "inwardFacing",
        label: "Inward facing",
        valueType: {
          type: "boolean",
        },
      },
    ],
  },
  execute: run,
});
export default tool;
