import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVloInput = {
  readonly stallingSpeed: number;
};

export type VSpeedVloOutput = {
  readonly vlo: number;
};

const VLO_MULTIPLIER = 1.7;

export const vSpeedVloExample = {
  input: { stallingSpeed: 100 },
  output: { vlo: 170 },
} satisfies ToolExample<VSpeedVloInput, VSpeedVloOutput>;

export const calculateVSpeedVlo = (input: VSpeedVloInput): VSpeedVloOutput => {
  if (input.stallingSpeed <= 0)
    simpleError(
      "stallingSpeed",
      "The stall speed must be positive.",
      "invalid_speed",
    );
  return { vlo: VLO_MULTIPLIER * input.stallingSpeed };
};

export const vSpeedVloTool = createSimpleTool({
  calculate: (input) => calculateVSpeedVlo(input as unknown as VSpeedVloInput),
  description:
    "Compute the maximum landing gear operating speed as 1.7 times the stall speed.",
  id: "aviation/v-speed-vlo",
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
      description: "Maximum landing gear operating speed.",
      format: "speed",
      id: "vlo",
      kind: "number",
      label: "VLO",
      unit: "kt",
    },
  ],
  title: "VLO Speed Calculator",
});
export const runVSpeedVlo = vSpeedVloTool.execute;
export default vSpeedVloTool;
