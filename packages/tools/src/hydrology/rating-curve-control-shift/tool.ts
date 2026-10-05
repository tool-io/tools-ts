import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStage: number;
  readonly stageShift: number;
};
export type Output = { readonly adjustedStage: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStage: { type: "number" },
    stageShift: { type: "number" },
  },
  required: ["observedStage", "stageShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjustedStage: { type: "number" } },
  required: ["adjustedStage"],
} as const;
/** Apply a signed caller-supplied stage correction before using an external rating curve; no stage-discharge curve or shift is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedStage, stageShift } = request;
  const compute = (): Output => {
    return { adjustedStage: observedStage + stageShift };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedStage: 2.4, stageShift: -0.2 },
  output: { adjustedStage: 2.1999999999999997 },
} satisfies ToolExample<Input, Output>;
export const ratingCurveControlShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rating-curve-control-shift",
    title: "Rating Curve Control Shift Tool",
    description:
      "Apply a signed caller-supplied stage correction before using an external rating curve; no stage-discharge curve or shift is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStage: { type: "number" },
        stageShift: { type: "number" },
      },
      required: ["observedStage", "stageShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { adjustedStage: { type: "number" } },
      required: ["adjustedStage"],
    },
    ports: {
      inputs: [
        {
          id: "observedStage",
          label: "Observed Stage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stageShift",
          label: "Stage Shift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustedStage",
          label: "Adjusted Stage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ratingCurveControlShiftTool.execute;
export default ratingCurveControlShiftTool;
