import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const audioThdPlusNoiseExample = {
  input: { fundamentalV: 1, harmonicsAndNoiseV: 0.01 },
} satisfies ToolExample<{
  readonly fundamentalV: number;
  readonly harmonicsAndNoiseV: number;
}>;

export const audioThdPlusNoiseTool = createSimpleTool({
  id: "electronics/audio-thd-plus-noise",
  title: "THD+N Percent",
  description:
    "Compute THD+N percentage from the RMS residual and fundamental as thdnPercent = sqrt(harmonicsAndNoiseV^2) / fundamentalV * 100.",
  inputs: [
    {
      description: "RMS amplitude of the fundamental tone.",
      id: "fundamentalV",
      kind: "number",
      label: "Fundamental",
      unit: "V",
    },
    {
      description: "Total RMS residual of harmonics plus noise.",
      id: "harmonicsAndNoiseV",
      kind: "number",
      label: "Harmonics + Noise",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "THD+N ratio expressed as a percentage.",
      id: "thdPlusNoisePercent",
      kind: "number",
      label: "THD+N",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const fundamentalV = input.fundamentalV as number;
    const harmonicsAndNoiseV = input.harmonicsAndNoiseV as number;
    if (!(fundamentalV > 0))
      simpleError("fundamentalV", "Fundamental amplitude must be positive.");
    if (!(harmonicsAndNoiseV >= 0))
      simpleError(
        "harmonicsAndNoiseV",
        "Residual amplitude must not be negative.",
      );
    return {
      thdPlusNoisePercent:
        (Math.sqrt(harmonicsAndNoiseV * harmonicsAndNoiseV) / fundamentalV) *
        100,
    };
  },
});
export const runAudioThdPlusNoise = audioThdPlusNoiseTool.execute;
export default audioThdPlusNoiseTool;
