import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly center: number;
  readonly normalizedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    center: { type: "number" },
    normalizedOffset: { type: "number" },
  },
  required: ["center", "normalizedOffset"],
} as const;
/** Center a supplied value on a signed interval coordinate without clamping extrapolation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower < upper);
    return {
      center: lower + (upper - lower) / 2,
      normalizedOffset: (2 * (value - lower)) / (upper - lower) - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 7, lower: 0, upper: 10 },
  output: { center: 5, normalizedOffset: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const signedRangeCenterOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/signed-range-center-offset",
    title: "Signed Range Center Offset Tool",
    description:
      "Center a supplied value on a signed interval coordinate without clamping extrapolation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["value", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        center: { type: "number" },
        normalizedOffset: { type: "number" },
      },
      required: ["center", "normalizedOffset"],
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
      ],
      outputs: [
        { id: "center", label: "Center", valueType: { type: "number" } },
        {
          id: "normalizedOffset",
          label: "Normalized Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = signedRangeCenterOffsetTool.execute;
export default signedRangeCenterOffsetTool;
