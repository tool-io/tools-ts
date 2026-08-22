import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVs0Input = {
  readonly cleanStallSpeed: number;
};

export type VSpeedVs0Output = {
  readonly vs0: number;
};

const VS0_DIVISOR = 1.15;

export const vSpeedVs0Example = {
  input: { cleanStallSpeed: 50 },
  output: { vs0: 43.47826086956522 },
} satisfies ToolExample<VSpeedVs0Input, VSpeedVs0Output>;

export const calculateVSpeedVs0 = (input: VSpeedVs0Input): VSpeedVs0Output => {
  if (input.cleanStallSpeed <= 0)
    simpleError(
      "cleanStallSpeed",
      "The clean stall speed must be positive.",
      "invalid_speed",
    );
  return { vs0: input.cleanStallSpeed / VS0_DIVISOR };
};

export const vSpeedVs0Tool = createSimpleTool({
  calculate: (input) => calculateVSpeedVs0(input as unknown as VSpeedVs0Input),
  description:
    "Estimated landing-configuration stall speed from clean stall speed.",
  id: "aviation/v-speed-vs0",
  inputs: [
    {
      description: "Clean-configuration stall speed of the aircraft.",
      id: "cleanStallSpeed",
      kind: "number",
      label: "Clean stall speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Landing-configuration stall speed.",
      format: "speed",
      id: "vs0",
      kind: "number",
      label: "VS0",
      unit: "kt",
    },
  ],
  title: "VS0 Speed Calculator",
});
export const runVSpeedVs0 = vSpeedVs0Tool.execute;
export default vSpeedVs0Tool;
