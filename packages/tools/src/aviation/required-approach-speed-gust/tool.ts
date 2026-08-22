import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RequiredApproachSpeedGustInput = {
  readonly referenceApproachSpeedKt: number;
  readonly gustSpreadKt: number;
};

export type RequiredApproachSpeedGustOutput = {
  readonly targetApproachSpeedKt: number;
};

export const requiredApproachSpeedGustExample = {
  input: { referenceApproachSpeedKt: 130, gustSpreadKt: 30 },
  output: { targetApproachSpeedKt: 145 },
} satisfies ToolExample<
  RequiredApproachSpeedGustInput,
  RequiredApproachSpeedGustOutput
>;

export const calculateRequiredApproachSpeedGust = (
  input: RequiredApproachSpeedGustInput,
): RequiredApproachSpeedGustOutput => {
  if (input.referenceApproachSpeedKt <= 0)
    simpleError(
      "referenceApproachSpeedKt",
      "The reference approach speed must be greater than zero.",
      "invalid_reference_speed",
    );
  if (input.gustSpreadKt < 0)
    simpleError(
      "gustSpreadKt",
      "The gust spread cannot be negative.",
      "invalid_gust_spread",
    );
  return {
    targetApproachSpeedKt:
      input.referenceApproachSpeedKt + input.gustSpreadKt / 2,
  };
};

export const requiredApproachSpeedGustTool = createSimpleTool({
  calculate: (input) =>
    calculateRequiredApproachSpeedGust(
      input as unknown as RequiredApproachSpeedGustInput,
    ),
  description:
    "Add half the reported gust spread to the reference approach speed for gusty conditions.",
  id: "aviation/required-approach-speed-gust",
  inputs: [
    {
      description: "Normal reference approach speed in smooth air.",
      id: "referenceApproachSpeedKt",
      kind: "number",
      label: "Reference approach speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Difference between gust and sustained wind speed.",
      id: "gustSpreadKt",
      kind: "number",
      label: "Gust spread",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Adjusted target approach speed for the gusty day.",
      format: "speed",
      id: "targetApproachSpeedKt",
      kind: "number",
      label: "Target approach speed",
      unit: "kt",
    },
  ],
  title: "Required Approach Speed Gust Calculator",
});
export const runRequiredApproachSpeedGust =
  requiredApproachSpeedGustTool.execute;
export default requiredApproachSpeedGustTool;
