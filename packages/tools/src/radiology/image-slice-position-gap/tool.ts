import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSlicePosition: number;
  readonly secondSlicePosition: number;
};
export type Output = {
  readonly signedGap: number;
  readonly absoluteGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSlicePosition: { type: "number" },
    secondSlicePosition: { type: "number" },
  },
  required: ["firstSlicePosition", "secondSlicePosition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedGap: { type: "number" },
    absoluteGap: { type: "number" },
  },
  required: ["signedGap", "absoluteGap"],
} as const;
/** Compare explicit slice positions on the same scalar normal coordinate without treating position gap as slice thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstSlicePosition, secondSlicePosition } = request;
  const compute = (): Output => {
    return {
      signedGap: secondSlicePosition - firstSlicePosition,
      absoluteGap: Math.abs(secondSlicePosition - firstSlicePosition),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstSlicePosition: 10, secondSlicePosition: 12.5 },
  output: { signedGap: 2.5, absoluteGap: 2.5 },
} satisfies ToolExample<Input, Output>;
export const imageSlicePositionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/image-slice-position-gap",
    title: "Image Slice Position Gap",
    description:
      "Compare explicit slice positions on the same scalar normal coordinate without treating position gap as slice thickness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSlicePosition: { type: "number" },
        secondSlicePosition: { type: "number" },
      },
      required: ["firstSlicePosition", "secondSlicePosition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedGap: { type: "number" },
        absoluteGap: { type: "number" },
      },
      required: ["signedGap", "absoluteGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstSlicePosition",
          label: "First Slice Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondSlicePosition",
          label: "Second Slice Position",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = imageSlicePositionGapTool.execute;
export default imageSlicePositionGapTool;
