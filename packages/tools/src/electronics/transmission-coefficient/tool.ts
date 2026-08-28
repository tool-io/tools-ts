import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransmissionCoefficientInput = {
  readonly reflectionCoefficientMagnitude: number;
};

export type TransmissionCoefficientOutput = {
  readonly transmissionCoefficientTau: number;
};

export const transmissionCoefficientExample = {
  input: { reflectionCoefficientMagnitude: 0.5 },
  output: { transmissionCoefficientTau: 0.75 },
} satisfies ToolExample<
  TransmissionCoefficientInput,
  TransmissionCoefficientOutput
>;

export const transmissionCoefficientTool = createSimpleTool({
  calculate: (input) => {
    const reflectionCoefficientMagnitude =
      input.reflectionCoefficientMagnitude as number;
    if (reflectionCoefficientMagnitude > 1)
      simpleError(
        "reflectionCoefficientMagnitude",
        "Reflection coefficient magnitude must not exceed one.",
        "invalid_reflection",
      );
    return {
      transmissionCoefficientTau:
        1 - Math.pow(reflectionCoefficientMagnitude, 2),
    };
  },
  description:
    "Compute the power transmission coefficient tau as one minus the square of the reflection coefficient magnitude.",
  id: "electronics/transmission-coefficient",
  inputs: [
    {
      id: "reflectionCoefficientMagnitude",
      kind: "number",
      label: "Reflection coefficient magnitude",
    },
  ],
  outputs: [
    {
      id: "transmissionCoefficientTau",
      kind: "number",
      label: "Transmission coefficient",
    },
  ],
  title: "Transmission Coefficient",
});
export const runTransmissionCoefficient = transmissionCoefficientTool.execute;
export default transmissionCoefficientTool;
