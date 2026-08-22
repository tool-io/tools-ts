import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VappSpeedInput = {
  readonly vrefKt: number;
  readonly windCorrectionKt?: number;
};

export type VappSpeedOutput = {
  readonly vappKt: number;
};

export const vappSpeedExample = {
  input: { vrefKt: 70, windCorrectionKt: 10 },
  output: { vappKt: 80 },
} satisfies ToolExample<VappSpeedInput, VappSpeedOutput>;

export const calculateVappSpeed = (input: VappSpeedInput): VappSpeedOutput => {
  const correction = input.windCorrectionKt ?? 0;
  if (correction < 0)
    simpleError(
      "windCorrectionKt",
      "The wind correction cannot be negative.",
      "invalid_correction",
    );
  return { vappKt: input.vrefKt + correction };
};

export const vappSpeedTool = createSimpleTool({
  calculate: (input) => calculateVappSpeed(input as unknown as VappSpeedInput),
  description:
    "Compute the final approach speed by adding a wind/gust correction to the reference speed.",
  id: "aviation/vapp-speed",
  inputs: [
    {
      description: "Final-approach reference speed.",
      id: "vrefKt",
      kind: "number",
      label: "Vref",
      unit: "kt",
    },
    {
      default: 0,
      description: "Additive for wind and gusts, chosen per operator policy.",
      id: "windCorrectionKt",
      kind: "number",
      label: "Wind additive",
      unit: "kt",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Target final-approach speed.",
      format: "speed",
      id: "vappKt",
      kind: "number",
      label: "Vapp",
      unit: "kt",
    },
  ],
  title: "Vapp Speed Calculator",
});
export const runVappSpeed = vappSpeedTool.execute;
export default vappSpeedTool;
