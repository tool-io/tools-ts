import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedEffect: number;
  readonly higherFavorable: boolean;
};
export type Output = { readonly favorabilityOrientedEffect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedEffect: { type: "number" },
    higherFavorable: { type: "boolean" },
  },
  required: ["reportedEffect", "higherFavorable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { favorabilityOrientedEffect: { type: "number" } },
  required: ["favorabilityOrientedEffect"],
} as const;
/** Apply an explicit research outcome direction flag without an efficacy judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedEffect, higherFavorable } = request;
  const compute = (): Output => {
    return {
      favorabilityOrientedEffect: reportedEffect * (higherFavorable ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedEffect: 2, higherFavorable: true },
  output: { favorabilityOrientedEffect: 2 },
} satisfies ToolExample<Input, Output>;
export const reviewOutcomeScaleDirectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "acupuncture/review-outcome-scale-direction",
    title: "Review Outcome Scale Direction Tool",
    description:
      "Apply an explicit research outcome direction flag without an efficacy judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedEffect: { type: "number" },
        higherFavorable: { type: "boolean" },
      },
      required: ["reportedEffect", "higherFavorable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { favorabilityOrientedEffect: { type: "number" } },
      required: ["favorabilityOrientedEffect"],
    },
    ports: {
      inputs: [
        {
          id: "reportedEffect",
          label: "Reported Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherFavorable",
          label: "Higher Favorable",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "favorabilityOrientedEffect",
          label: "Favorability Oriented Effect",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reviewOutcomeScaleDirectionTool.execute;
export default reviewOutcomeScaleDirectionTool;
