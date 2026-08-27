import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const audioPowerToSplExample = {
  input: { amplifierWatts: 100, sensitivityDbPerW1m: 87 },
} satisfies ToolExample<{
  readonly amplifierWatts: number;
  readonly sensitivityDbPerW1m: number;
}>;

export const audioPowerToSplTool = createSimpleTool({
  id: "electronics/audio-power-to-spl",
  title: "Power To SPL",
  description:
    "Estimate loudspeaker output level as splAtMeterDb = sensitivityDbPerW1m + 10 * log10(amplifierWatts).",
  inputs: [
    {
      description: "Speaker sensitivity at one watt and one meter.",
      id: "sensitivityDbPerW1m",
      kind: "number",
      label: "Sensitivity",
      unit: "dB/W/m",
    },
    {
      description: "Amplifier power delivered.",
      id: "amplifierWatts",
      kind: "number",
      label: "Amplifier Power",
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "SPL at one meter for the given power.",
      id: "splOneMeterDb",
      kind: "number",
      label: "SPL at 1 m",
      unit: "dB SPL",
    },
  ],
  calculate: (input) => {
    const amplifierWatts = input.amplifierWatts as number;
    if (!(amplifierWatts > 0))
      simpleError("amplifierWatts", "Amplifier power must be positive.");
    return {
      splOneMeterDb:
        (input.sensitivityDbPerW1m as number) + 10 * Math.log10(amplifierWatts),
    };
  },
});
export const runAudioPowerToSpl = audioPowerToSplTool.execute;
export default audioPowerToSplTool;
