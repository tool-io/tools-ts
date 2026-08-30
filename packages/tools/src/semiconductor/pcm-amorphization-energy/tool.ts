import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PcmAmorphizationEnergyInput = Readonly<{
  readonly pulseWatts: number;
  readonly pulseSeconds: number;
}>;
export type PcmAmorphizationEnergyOutput = Readonly<{
  readonly deliveredJoules: number;
}>;

export const calculatePcmAmorphizationEnergy = (
  x: PcmAmorphizationEnergyInput,
): PcmAmorphizationEnergyOutput => {
  if (!Number.isFinite(x.pulseWatts) || x.pulseWatts < 0)
    simpleError("pulseWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.pulseSeconds) || x.pulseSeconds < 0)
    simpleError("pulseSeconds", "Provide a finite number at least 0.");
  const deliveredJoules = x.pulseWatts * x.pulseSeconds;
  if (!Number.isFinite(deliveredJoules))
    simpleError(
      "deliveredJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    deliveredJoules: Object.is(deliveredJoules, -0) ? 0 : deliveredJoules,
  };
};

export const example = {
  input: { pulseWatts: 0.1, pulseSeconds: 0.000001 },
  output: { deliveredJoules: 1e-7 },
} satisfies ToolExample<
  PcmAmorphizationEnergyInput,
  PcmAmorphizationEnergyOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/pcm-amorphization-energy",
  title: "PCM Amorphization Energy",
  description:
    "Electrical energy delivered during a phase-change reset pulse from average electrical power and pulse duration; excludes thermal losses.",
  inputs: [
    {
      id: "pulseWatts",
      kind: "number",
      label: "Pulse Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "pulseSeconds",
      kind: "number",
      label: "Pulse Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "deliveredJoules",
      kind: "number",
      label: "Delivered Joules",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculatePcmAmorphizationEnergy({
      pulseWatts: input.pulseWatts as number,
      pulseSeconds: input.pulseSeconds as number,
    }),
});
export const pcmAmorphizationEnergyTool = tool;
export const runPcmAmorphizationEnergy = tool.execute;
export default tool;
