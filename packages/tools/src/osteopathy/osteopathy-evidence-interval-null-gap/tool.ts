import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly nullValue: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
};
export type Output = {
  readonly width: number;
  readonly lowerGap: number;
  readonly upperGap: number;
  readonly includesNull: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    nullValue: { type: "number" },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
  },
  required: ["lower", "upper", "nullValue", "lowerClosed", "upperClosed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    lowerGap: { type: "number" },
    upperGap: { type: "number" },
    includesNull: { type: "boolean" },
  },
  required: ["width", "lowerGap", "upperGap", "includesNull"],
} as const;
/** Audit a supplied effect interval and explicit null/end-point convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, nullValue, lowerClosed, upperClosed } = request;
  const compute = (): Output => {
    H.domain(upper >= lower);
    return {
      width: upper - lower,
      lowerGap: nullValue - lower,
      upperGap: upper - nullValue,
      includesNull:
        (lowerClosed ? nullValue >= lower : nullValue > lower) &&
        (upperClosed ? nullValue <= upper : nullValue < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lower: -0.2,
    upper: 0.5,
    nullValue: 0,
    lowerClosed: true,
    upperClosed: true,
  },
  output: { width: 0.7, lowerGap: 0.2, upperGap: 0.5, includesNull: true },
} satisfies ToolExample<Input, Output>;
export const osteopathyEvidenceIntervalNullGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "osteopathy/osteopathy-evidence-interval-null-gap",
    title: "Osteopathy Evidence Interval Null Gap Tool",
    description:
      "Audit a supplied effect interval and explicit null/end-point convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        nullValue: { type: "number" },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
      },
      required: ["lower", "upper", "nullValue", "lowerClosed", "upperClosed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        lowerGap: { type: "number" },
        upperGap: { type: "number" },
        includesNull: { type: "boolean" },
      },
      required: ["width", "lowerGap", "upperGap", "includesNull"],
    },
    ports: {
      inputs: [
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
          id: "nullValue",
          label: "Null Value",
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
        { id: "width", label: "Width", valueType: { type: "number" } },
        { id: "lowerGap", label: "Lower Gap", valueType: { type: "number" } },
        { id: "upperGap", label: "Upper Gap", valueType: { type: "number" } },
        {
          id: "includesNull",
          label: "Includes Null",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = osteopathyEvidenceIntervalNullGapTool.execute;
export default osteopathyEvidenceIntervalNullGapTool;
