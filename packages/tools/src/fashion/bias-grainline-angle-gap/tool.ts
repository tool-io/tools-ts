import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angleDegrees: number;
  readonly suppliedBiasDegrees: number;
};
export type Output = { readonly acuteGapDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleDegrees: { type: "number" },
    suppliedBiasDegrees: { type: "number" },
  },
  required: ["angleDegrees", "suppliedBiasDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { acuteGapDegrees: { type: "number" } },
  required: ["acuteGapDegrees"],
} as const;
/** Compare unoriented fabric grain axes modulo 180 degrees with an explicit bias reference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angleDegrees, suppliedBiasDegrees } = request;
  const compute = (): Output => {
    return {
      acuteGapDegrees: Math.min(
        H.mod(angleDegrees - suppliedBiasDegrees, 180),
        180 - H.mod(angleDegrees - suppliedBiasDegrees, 180),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angleDegrees: 50, suppliedBiasDegrees: 45 },
  output: { acuteGapDegrees: 5 },
} satisfies ToolExample<Input, Output>;
export const biasGrainlineAngleGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/bias-grainline-angle-gap",
    title: "Bias Grainline Angle Gap Tool",
    description:
      "Compare unoriented fabric grain axes modulo 180 degrees with an explicit bias reference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleDegrees: { type: "number" },
        suppliedBiasDegrees: { type: "number" },
      },
      required: ["angleDegrees", "suppliedBiasDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { acuteGapDegrees: { type: "number" } },
      required: ["acuteGapDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "angleDegrees",
          label: "Angle Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBiasDegrees",
          label: "Supplied Bias Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "acuteGapDegrees",
          label: "Acute Gap Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biasGrainlineAngleGapTool.execute;
export default biasGrainlineAngleGapTool;
