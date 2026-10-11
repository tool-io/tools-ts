import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixelValue: number;
  readonly paddingValue: number;
  readonly paddingRangeLimit: number;
  readonly useRange: boolean;
};
export type Output = { readonly padding: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixelValue: { type: "number" },
    paddingValue: { type: "number" },
    paddingRangeLimit: { type: "number" },
    useRange: { type: "boolean" },
  },
  required: ["pixelValue", "paddingValue", "paddingRangeLimit", "useRange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { padding: { type: "boolean" } },
  required: ["padding"],
} as const;
/** Identify a supplied pixel as exact padding or within an explicit inclusive padding range without changing image values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixelValue, paddingValue, paddingRangeLimit, useRange } = request;
  const compute = (): Output => {
    return {
      padding: useRange
        ? pixelValue >= Math.min(paddingValue, paddingRangeLimit) &&
          pixelValue <= Math.max(paddingValue, paddingRangeLimit)
        : pixelValue === paddingValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixelValue: -2000,
    paddingValue: -2000,
    paddingRangeLimit: -1000,
    useRange: true,
  },
  output: { padding: true },
} satisfies ToolExample<Input, Output>;
export const imagePaddingValueMaskTool = H.defineSchemaCalculation<
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
    id: "radiology/image-padding-value-mask",
    title: "Image Padding Value Mask",
    description:
      "Identify a supplied pixel as exact padding or within an explicit inclusive padding range without changing image values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixelValue: { type: "number" },
        paddingValue: { type: "number" },
        paddingRangeLimit: { type: "number" },
        useRange: { type: "boolean" },
      },
      required: ["pixelValue", "paddingValue", "paddingRangeLimit", "useRange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { padding: { type: "boolean" } },
      required: ["padding"],
    },
    ports: {
      inputs: [
        {
          id: "pixelValue",
          label: "Pixel Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paddingValue",
          label: "Padding Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paddingRangeLimit",
          label: "Padding Range Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useRange",
          label: "Use Range",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "padding", label: "Padding", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = imagePaddingValueMaskTool.execute;
export default imagePaddingValueMaskTool;
