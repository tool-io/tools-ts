import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtSwitchingEnergyEoffInput = Readonly<{
  readonly blockingVolts: number;
  readonly switchedAmperes: number;
  readonly overlapSeconds: number;
}>;
export type IgbtSwitchingEnergyEoffOutput = Readonly<{
  readonly turnOffJoules: number;
}>;

export const calculateIgbtSwitchingEnergyEoff = (
  x: IgbtSwitchingEnergyEoffInput,
): IgbtSwitchingEnergyEoffOutput => {
  if (!Number.isFinite(x.blockingVolts) || x.blockingVolts < 0)
    simpleError("blockingVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.switchedAmperes) || x.switchedAmperes < 0)
    simpleError("switchedAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.overlapSeconds) || x.overlapSeconds < 0)
    simpleError("overlapSeconds", "Provide a finite number at least 0.");
  const turnOffJoules =
    0.5 * x.blockingVolts * x.switchedAmperes * x.overlapSeconds;
  if (!Number.isFinite(turnOffJoules))
    simpleError(
      "turnOffJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { turnOffJoules: Object.is(turnOffJoules, -0) ? 0 : turnOffJoules };
};

export const example = {
  input: { blockingVolts: 600, switchedAmperes: 10, overlapSeconds: 0.000002 },
  output: { turnOffJoules: 0.006 },
} satisfies ToolExample<
  IgbtSwitchingEnergyEoffInput,
  IgbtSwitchingEnergyEoffOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/igbt-switching-energy-eoff",
  title: "IGBT Switching Energy Eoff",
  description:
    "Triangular-overlap estimate of IGBT turn-off energy; tail current and stray-inductance overshoot require waveform integration.",
  inputs: [
    {
      id: "blockingVolts",
      kind: "number",
      label: "Blocking Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "switchedAmperes",
      kind: "number",
      label: "Switched Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "overlapSeconds",
      kind: "number",
      label: "Overlap Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "turnOffJoules",
      kind: "number",
      label: "Turn Off Joules",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculateIgbtSwitchingEnergyEoff({
      blockingVolts: input.blockingVolts as number,
      switchedAmperes: input.switchedAmperes as number,
      overlapSeconds: input.overlapSeconds as number,
    }),
});
export const igbtSwitchingEnergyEoffTool = tool;
export const runIgbtSwitchingEnergyEoff = tool.execute;
export default tool;
