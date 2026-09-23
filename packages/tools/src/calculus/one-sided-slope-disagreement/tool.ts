import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftSlope: number;
  readonly rightSlope: number;
  readonly tolerance: number;
};
export type Output = {
  readonly gap: number;
  readonly agreesWithinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSlope: { type: "number" },
    rightSlope: { type: "number" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["leftSlope", "rightSlope", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "number" },
    agreesWithinTolerance: { type: "boolean" },
  },
  required: ["gap", "agreesWithinTolerance"],
} as const;
/** Compare explicitly supplied one-sided slopes without estimating derivatives or proving differentiability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftSlope, rightSlope, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      gap: rightSlope - leftSlope,
      agreesWithinTolerance: Math.abs(rightSlope - leftSlope) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftSlope: 2, rightSlope: 3, tolerance: 0.5 },
  output: { gap: 1, agreesWithinTolerance: false },
} satisfies ToolExample<Input, Output>;
export const oneSidedSlopeDisagreementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/one-sided-slope-disagreement",
    title: "One Sided Slope Disagreement Tool",
    description:
      "Compare explicitly supplied one-sided slopes without estimating derivatives or proving differentiability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftSlope: { type: "number" },
        rightSlope: { type: "number" },
        tolerance: { type: "number", minimum: 0 },
      },
      required: ["leftSlope", "rightSlope", "tolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "number" },
        agreesWithinTolerance: { type: "boolean" },
      },
      required: ["gap", "agreesWithinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "leftSlope",
          label: "Left Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightSlope",
          label: "Right Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tolerance",
          label: "Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        {
          id: "agreesWithinTolerance",
          label: "Agrees Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = oneSidedSlopeDisagreementTool.execute;
export default oneSidedSlopeDisagreementTool;
