import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerTorqueRpmInput = Readonly<{
  readonly torqueNewtonMeters: number;
  readonly speedRpm: number;
}>;
export type PowerTorqueRpmOutput = Readonly<{
  readonly powerWatts: number;
}>;

export const calculatePowerTorqueRpm = (
  x: PowerTorqueRpmInput,
): PowerTorqueRpmOutput => {
  if (!Number.isFinite(x.torqueNewtonMeters) || x.torqueNewtonMeters < 0)
    simpleError("torqueNewtonMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.speedRpm) || x.speedRpm < 0)
    simpleError("speedRpm", "Provide a finite number at least 0.");
  const powerWatts = (x.torqueNewtonMeters * 2 * Math.PI * x.speedRpm) / 60;
  if (!Number.isFinite(powerWatts))
    simpleError(
      "powerWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { powerWatts: Object.is(powerWatts, -0) ? 0 : powerWatts };
};

export const example = {
  input: { torqueNewtonMeters: 10, speedRpm: 600 },
  output: { powerWatts: 628.3185307179587 },
} satisfies ToolExample<PowerTorqueRpmInput, PowerTorqueRpmOutput>;

export const tool = createSimpleTool({
  id: "engineering/power-torque-rpm",
  title: "Power Torque RPM",
  description:
    "Mechanical shaft power from torque and revolutions per minute using P=T·2πn/60.",
  inputs: [
    {
      id: "torqueNewtonMeters",
      kind: "number",
      label: "Torque Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "speedRpm",
      kind: "number",
      label: "Speed Rpm",
      unit: "rpm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "powerWatts", kind: "number", label: "Power Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculatePowerTorqueRpm({
      torqueNewtonMeters: input.torqueNewtonMeters as number,
      speedRpm: input.speedRpm as number,
    }),
});
export const powerTorqueRpmTool = tool;
export const runPowerTorqueRpm = tool.execute;
export default tool;
