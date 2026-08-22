import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VSpeedVfeInput = {
  readonly stallingSpeed: number;
};

export type VSpeedVfeOutput = {
  readonly vfe: number;
};

const VFE_MULTIPLIER = 1.6;

export const vSpeedVfeExample = {
  input: { stallingSpeed: 100 },
  output: { vfe: 160 },
} satisfies ToolExample<VSpeedVfeInput, VSpeedVfeOutput>;

export const calculateVSpeedVfe = (input: VSpeedVfeInput): VSpeedVfeOutput => {
  if (input.stallingSpeed <= 0)
    simpleError(
      "stallingSpeed",
      "The stall speed must be positive.",
      "invalid_speed",
    );
  return { vfe: VFE_MULTIPLIER * input.stallingSpeed };
};

export const vSpeedVfeTool = createSimpleTool({
  calculate: (input) => calculateVSpeedVfe(input as unknown as VSpeedVfeInput),
  description:
    "Compute the maximum flap extension speed as 1.6 times the stall speed.",
  id: "aviation/v-speed-vfe",
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
      description: "Maximum flap extension speed.",
      format: "speed",
      id: "vfe",
      kind: "number",
      label: "VFE",
      unit: "kt",
    },
  ],
  title: "VFE Speed Calculator",
});
export const runVSpeedVfe = vSpeedVfeTool.execute;
export default vSpeedVfeTool;
