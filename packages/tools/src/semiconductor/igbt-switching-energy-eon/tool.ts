import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtSwitchingEnergyEonInput = Readonly<{
  readonly blockingVolts: number;
  readonly switchedAmperes: number;
  readonly overlapSeconds: number;
}>;
export type IgbtSwitchingEnergyEonOutput = Readonly<{
  readonly turnOnJoules: number;
}>;

export const calculateIgbtSwitchingEnergyEon = (
  x: IgbtSwitchingEnergyEonInput,
): IgbtSwitchingEnergyEonOutput => {
  if (!Number.isFinite(x.blockingVolts) || x.blockingVolts < 0)
    simpleError("blockingVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.switchedAmperes) || x.switchedAmperes < 0)
    simpleError("switchedAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.overlapSeconds) || x.overlapSeconds < 0)
    simpleError("overlapSeconds", "Provide a finite number at least 0.");
  const turnOnJoules =
    0.5 * x.blockingVolts * x.switchedAmperes * x.overlapSeconds;
  if (!Number.isFinite(turnOnJoules))
    simpleError(
      "turnOnJoules",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { turnOnJoules: Object.is(turnOnJoules, -0) ? 0 : turnOnJoules };
};

export const example = {
  input: { blockingVolts: 600, switchedAmperes: 10, overlapSeconds: 0.000001 },
  output: { turnOnJoules: 0.003 },
} satisfies ToolExample<
  IgbtSwitchingEnergyEonInput,
  IgbtSwitchingEnergyEonOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/igbt-switching-energy-eon",
  title: "IGBT Switching Energy Eon",
  description:
    "Triangular-overlap estimate of IGBT turn-on switching energy from blocking voltage, current and measured overlap time.",
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
    { id: "turnOnJoules", kind: "number", label: "Turn On Joules", unit: "J" },
  ],
  calculate: (input) =>
    calculateIgbtSwitchingEnergyEon({
      blockingVolts: input.blockingVolts as number,
      switchedAmperes: input.switchedAmperes as number,
      overlapSeconds: input.overlapSeconds as number,
    }),
});
export const igbtSwitchingEnergyEonTool = tool;
export const runIgbtSwitchingEnergyEon = tool.execute;
export default tool;
