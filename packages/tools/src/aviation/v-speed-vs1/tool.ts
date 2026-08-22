import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVs1Input = {
  readonly landingStallSpeed: number;
};

export type VSpeedVs1Output = {
  readonly vs1: number;
};

const VS1_MULTIPLIER = 1.15;

export const vSpeedVs1Example = {
  input: { landingStallSpeed: 50 },
  output: { vs1: 57.49999999999999 },
} satisfies ToolExample<VSpeedVs1Input, VSpeedVs1Output>;

export const calculateVSpeedVs1 = (input: VSpeedVs1Input): VSpeedVs1Output => {
  if (input.landingStallSpeed <= 0)
    simpleError(
      "landingStallSpeed",
      "The stall speed must be positive.",
      "invalid_speed",
    );
  return { vs1: VS1_MULTIPLIER * input.landingStallSpeed };
};

export const vSpeedVs1Tool = createSimpleTool({
  calculate: (input) => calculateVSpeedVs1(input as unknown as VSpeedVs1Input),
  description:
    "Compute the clean-configuration stall speed as 1.15 times the reference stall speed.",
  id: "aviation/v-speed-vs1",
  inputs: [
    {
      description: "Reference stall speed of the aircraft.",
      id: "landingStallSpeed",
      kind: "number",
      label: "Reference stall speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Clean-configuration stall speed.",
      format: "speed",
      id: "vs1",
      kind: "number",
      label: "VS1",
      unit: "kt",
    },
  ],
  title: "VS1 Speed Calculator",
});
export const runVSpeedVs1 = vSpeedVs1Tool.execute;
export default vSpeedVs1Tool;
