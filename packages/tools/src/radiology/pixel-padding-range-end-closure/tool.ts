import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = { readonly isPadding: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["value", "lower", "upper", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { isPadding: { type: "boolean" } },
  required: ["isPadding"],
} as const;
/** Apply supplied padding range endpoint flags without inferring a DICOM attribute definition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper, lowerClosed, upperClosed } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      isPadding:
        (lowerClosed ? value >= lower : value > lower) &&
        (upperClosed ? value <= upper : value < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    value: 0,
    lower: 0,
    upper: 10,
    lowerClosed: true,
    upperClosed: false,
  },
  output: { isPadding: true },
} satisfies ToolExample<Input, Output>;
export const pixelPaddingRangeEndClosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "radiology/pixel-padding-range-end-closure",
    title: "Pixel Padding Range End Closure Tool",
    description:
      "Apply supplied padding range endpoint flags without inferring a DICOM attribute definition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
      },
      required: ["value", "lower", "upper", "lowerClosed", "upperClosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { isPadding: { type: "boolean" } },
      required: ["isPadding"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerClosed",
          label: "Lower Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperClosed",
          label: "Upper Closed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
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
export const run = pixelPaddingRangeEndClosureTool.execute;
export default pixelPaddingRangeEndClosureTool;
