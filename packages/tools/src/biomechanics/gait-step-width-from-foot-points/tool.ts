import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftLateralCoordinate: number;
  readonly rightLateralCoordinate: number;
};
export type Output = {
  readonly stepWidth: number;
  readonly signedLateralGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftLateralCoordinate: { type: "number" },
    rightLateralCoordinate: { type: "number" },
  },
  required: ["leftLateralCoordinate", "rightLateralCoordinate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepWidth: { type: "number" },
    signedLateralGap: { type: "number" },
  },
  required: ["stepWidth", "signedLateralGap"],
} as const;
/** Measure a recorded foot-point lateral separation along an explicitly chosen common lateral axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftLateralCoordinate, rightLateralCoordinate } = request;
  const compute = (): Output => {
    return {
      stepWidth: Math.abs(rightLateralCoordinate - leftLateralCoordinate),
      signedLateralGap: rightLateralCoordinate - leftLateralCoordinate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftLateralCoordinate: -0.1, rightLateralCoordinate: 0.15 },
  output: { stepWidth: 0.25, signedLateralGap: 0.25 },
} satisfies ToolExample<Input, Output>;
export const gaitStepWidthFromFootPointsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/gait-step-width-from-foot-points",
    title: "Gait Step Width From Foot Points",
    description:
      "Measure a recorded foot-point lateral separation along an explicitly chosen common lateral axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftLateralCoordinate: { type: "number" },
        rightLateralCoordinate: { type: "number" },
      },
      required: ["leftLateralCoordinate", "rightLateralCoordinate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepWidth: { type: "number" },
        signedLateralGap: { type: "number" },
      },
      required: ["stepWidth", "signedLateralGap"],
    },
    ports: {
      inputs: [
        {
          id: "leftLateralCoordinate",
          label: "Left Lateral Coordinate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightLateralCoordinate",
          label: "Right Lateral Coordinate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "stepWidth", label: "Step Width", valueType: { type: "number" } },
        {
          id: "signedLateralGap",
          label: "Signed Lateral Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gaitStepWidthFromFootPointsTool.execute;
export default gaitStepWidthFromFootPointsTool;
