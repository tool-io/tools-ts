import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurement: number;
  readonly boundary: number;
  readonly equalityToUpper: boolean;
};
export type Output = { readonly gradeSide: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurement: { type: "number" },
    boundary: { type: "number" },
    equalityToUpper: { type: "boolean" },
  },
  required: ["measurement", "boundary", "equalityToUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gradeSide: { type: "string", maxLength: 8192 } },
  required: ["gradeSide"],
} as const;
/** Resolve a supplied grading measurement boundary without assigning a species or market grade. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurement, boundary, equalityToUpper } = request;
  const compute = (): Output => {
    return {
      gradeSide:
        measurement > boundary || (measurement === boundary && equalityToUpper)
          ? "upper"
          : "lower",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurement: 100, boundary: 100, equalityToUpper: true },
  output: { gradeSide: "upper" },
} satisfies ToolExample<Input, Output>;
export const fishGradeThresholdTieRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/fish-grade-threshold-tie-rule",
    title: "Fish Grade Threshold Tie Rule Tool",
    description:
      "Resolve a supplied grading measurement boundary without assigning a species or market grade.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurement: { type: "number" },
        boundary: { type: "number" },
        equalityToUpper: { type: "boolean" },
      },
      required: ["measurement", "boundary", "equalityToUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gradeSide: { type: "string", maxLength: 8192 } },
      required: ["gradeSide"],
    },
    ports: {
      inputs: [
        {
          id: "measurement",
          label: "Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "boundary",
          label: "Boundary",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityToUpper",
          label: "Equality To Upper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "gradeSide", label: "Grade Side", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fishGradeThresholdTieRuleTool.execute;
export default fishGradeThresholdTieRuleTool;
