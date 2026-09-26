import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly threshold: number;
  readonly equalityToUpper: boolean;
};
export type Output = { readonly band: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    threshold: { type: "number" },
    equalityToUpper: { type: "boolean" },
  },
  required: ["score", "threshold", "equalityToUpper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { band: { type: "string", maxLength: 8192 } },
  required: ["band"],
} as const;
/** Choose the side of one caller-supplied rubric boundary, without selecting a grading scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, threshold, equalityToUpper } = request;
  const compute = (): Output => {
    return {
      band:
        score > threshold || (score === threshold && equalityToUpper)
          ? "upper"
          : "lower",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 5, threshold: 5, equalityToUpper: true },
  output: { band: "upper" },
} satisfies ToolExample<Input, Output>;
export const rubricIntervalBoundaryTieTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/rubric-interval-boundary-tie",
    title: "Rubric Interval Boundary Tie Tool",
    description:
      "Choose the side of one caller-supplied rubric boundary, without selecting a grading scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        threshold: { type: "number" },
        equalityToUpper: { type: "boolean" },
      },
      required: ["score", "threshold", "equalityToUpper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { band: { type: "string", maxLength: 8192 } },
      required: ["band"],
    },
    ports: {
      inputs: [
        {
          id: "score",
          label: "Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
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
      outputs: [{ id: "band", label: "Band", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = rubricIntervalBoundaryTieTool.execute;
export default rubricIntervalBoundaryTieTool;
