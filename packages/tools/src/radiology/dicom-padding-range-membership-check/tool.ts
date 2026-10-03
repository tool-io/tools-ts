import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pixel: number;
  readonly paddingValue: number;
  readonly rangeLimit: number;
  readonly hasRange: boolean;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly isPadding: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pixel: { type: "number" },
    paddingValue: { type: "number" },
    rangeLimit: { type: "number" },
    hasRange: { type: "boolean" },
  },
  required: ["pixel", "paddingValue", "rangeLimit", "hasRange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    isPadding: { type: "boolean" },
  },
  required: ["lower", "upper", "isPadding"],
} as const;
/** Inclusive stored-value padding range from supplied DICOM endpoints; no modality rescale or image-content interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pixel, paddingValue, rangeLimit, hasRange } = request;
  const compute = (): Output => {
    return {
      lower: hasRange ? Math.min(paddingValue, rangeLimit) : paddingValue,
      upper: hasRange ? Math.max(paddingValue, rangeLimit) : paddingValue,
      isPadding: hasRange
        ? pixel >= Math.min(paddingValue, rangeLimit) &&
          pixel <= Math.max(paddingValue, rangeLimit)
        : pixel === paddingValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pixel: -2005,
    paddingValue: -2000,
    rangeLimit: -2010,
    hasRange: true,
  },
  output: { lower: -2010, upper: -2000, isPadding: true },
} satisfies ToolExample<Input, Output>;
export const dicomPaddingRangeMembershipCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/dicom-padding-range-membership-check",
    title: "DICOM Padding Range Membership Check Tool",
    description:
      "Inclusive stored-value padding range from supplied DICOM endpoints; no modality rescale or image-content interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pixel: { type: "number" },
        paddingValue: { type: "number" },
        rangeLimit: { type: "number" },
        hasRange: { type: "boolean" },
      },
      required: ["pixel", "paddingValue", "rangeLimit", "hasRange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        isPadding: { type: "boolean" },
      },
      required: ["lower", "upper", "isPadding"],
    },
    ports: {
      inputs: [
        {
          id: "pixel",
          label: "Pixel",
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
          id: "rangeLimit",
          label: "Range Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hasRange",
          label: "Has Range",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "isPadding",
          label: "Is Padding",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomPaddingRangeMembershipCheckTool.execute;
export default dicomPaddingRangeMembershipCheckTool;
