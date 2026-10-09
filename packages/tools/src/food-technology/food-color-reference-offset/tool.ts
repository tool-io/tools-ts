import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedL: number;
  readonly recordedA: number;
  readonly recordedB: number;
  readonly referenceL: number;
  readonly referenceA: number;
  readonly referenceB: number;
};
export type Output = {
  readonly deltaL: number;
  readonly deltaA: number;
  readonly deltaB: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedL: { type: "number" },
    recordedA: { type: "number" },
    recordedB: { type: "number" },
    referenceL: { type: "number" },
    referenceA: { type: "number" },
    referenceB: { type: "number" },
  },
  required: [
    "recordedL",
    "recordedA",
    "recordedB",
    "referenceL",
    "referenceA",
    "referenceB",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deltaL: { type: "number" },
    deltaA: { type: "number" },
    deltaB: { type: "number" },
  },
  required: ["deltaL", "deltaA", "deltaB"],
} as const;
/** Subtract an explicit reference from supplied CIELAB coordinates without computing perceptual color difference or measuring color. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    recordedL,
    recordedA,
    recordedB,
    referenceL,
    referenceA,
    referenceB,
  } = request;
  const compute = (): Output => {
    return {
      deltaL: recordedL - referenceL,
      deltaA: recordedA - referenceA,
      deltaB: recordedB - referenceB,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedL: 55,
    recordedA: 8,
    recordedB: 12,
    referenceL: 50,
    referenceA: 10,
    referenceB: 10,
  },
  output: { deltaL: 5, deltaA: -2, deltaB: 2 },
} satisfies ToolExample<Input, Output>;
export const foodColorReferenceOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/food-color-reference-offset",
    title: "Food Color Reference Offset",
    description:
      "Subtract an explicit reference from supplied CIELAB coordinates without computing perceptual color difference or measuring color.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedL: { type: "number" },
        recordedA: { type: "number" },
        recordedB: { type: "number" },
        referenceL: { type: "number" },
        referenceA: { type: "number" },
        referenceB: { type: "number" },
      },
      required: [
        "recordedL",
        "recordedA",
        "recordedB",
        "referenceL",
        "referenceA",
        "referenceB",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deltaL: { type: "number" },
        deltaA: { type: "number" },
        deltaB: { type: "number" },
      },
      required: ["deltaL", "deltaA", "deltaB"],
    },
    ports: {
      inputs: [
        {
          id: "recordedL",
          label: "Recorded L",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedA",
          label: "Recorded A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedB",
          label: "Recorded B",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceL",
          label: "Reference L",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceA",
          label: "Reference A",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceB",
          label: "Reference B",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "deltaL", label: "Delta L", valueType: { type: "number" } },
        { id: "deltaA", label: "Delta A", valueType: { type: "number" } },
        { id: "deltaB", label: "Delta B", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = foodColorReferenceOffsetTool.execute;
export default foodColorReferenceOffsetTool;
