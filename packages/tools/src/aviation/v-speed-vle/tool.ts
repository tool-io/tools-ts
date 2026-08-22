import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVleInput = {
  readonly stallingSpeed: number;
};

export type VSpeedVleOutput = {
  readonly vle: number;
};

const VLE_MULTIPLIER = 1.8;

export const vSpeedVleExample = {
  input: { stallingSpeed: 100 },
  output: { vle: 180 },
} satisfies ToolExample<VSpeedVleInput, VSpeedVleOutput>;

export const calculateVSpeedVle = (input: VSpeedVleInput): VSpeedVleOutput => {
  if (input.stallingSpeed <= 0)
    simpleError(
      "stallingSpeed",
      "The stall speed must be positive.",
      "invalid_speed",
    );
  return { vle: VLE_MULTIPLIER * input.stallingSpeed };
};

export const vSpeedVleTool = createSimpleTool({
  calculate: (input) => calculateVSpeedVle(input as unknown as VSpeedVleInput),
  description:
    "Compute the maximum landing gear extended speed as 1.8 times the stall speed.",
  id: "aviation/v-speed-vle",
  inputs: [
    {
      description: "Stall speed of the aircraft.",
      id: "stallingSpeed",
      kind: "number",
      label: "Stall speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Maximum landing gear extended speed.",
      format: "speed",
      id: "vle",
      kind: "number",
      label: "VLE",
      unit: "kt",
    },
  ],
  title: "VLE Speed Calculator",
});
export const runVSpeedVle = vSpeedVleTool.execute;
export default vSpeedVleTool;
