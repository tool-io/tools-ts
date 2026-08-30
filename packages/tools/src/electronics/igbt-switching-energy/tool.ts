import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtSwitchingEnergyInput = Readonly<{
  readonly busVoltageV: number;
  readonly switchCurrentA: number;
  readonly voltageRiseTimeS: number;
  readonly currentFallTimeS: number;
}>;
export type IgbtSwitchingEnergyOutput = Readonly<{
  readonly switchingEnergyJ: number;
}>;

export const calculateIgbtSwitchingEnergy = (
  x: IgbtSwitchingEnergyInput,
): IgbtSwitchingEnergyOutput => {
  if (!Number.isFinite(x.busVoltageV) || x.busVoltageV < 0)
    simpleError("busVoltageV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.switchCurrentA) || x.switchCurrentA < 0)
    simpleError("switchCurrentA", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.voltageRiseTimeS) || x.voltageRiseTimeS < 0)
    simpleError("voltageRiseTimeS", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.currentFallTimeS) || x.currentFallTimeS < 0)
    simpleError("currentFallTimeS", "Provide a finite number at least 0.");
  const switchingEnergyJ =
    0.5 *
    x.busVoltageV *
    x.switchCurrentA *
    (x.voltageRiseTimeS + x.currentFallTimeS);
  if (!Number.isFinite(switchingEnergyJ))
    simpleError("switchingEnergyJ", "The inputs produce an invalid result.");
  return {
    switchingEnergyJ: Object.is(switchingEnergyJ, -0) ? 0 : switchingEnergyJ,
  };
};

export const example = {
  input: {
    busVoltageV: 400,
    switchCurrentA: 10,
    voltageRiseTimeS: 0.000001,
    currentFallTimeS: 0.000001,
  },
  output: { switchingEnergyJ: 0.004 },
} satisfies ToolExample<IgbtSwitchingEnergyInput, IgbtSwitchingEnergyOutput>;

export const tool = createSimpleTool({
  id: "electronics/igbt-switching-energy",
  title: "IGBT Switching Energy",
  description:
    "Estimate one hard-switching event's voltage-current overlap energy with linear current and voltage transitions; excludes tail current and parasitics.",
  inputs: [
    {
      id: "busVoltageV",
      kind: "number",
      label: "Bus voltage",
      unit: "V",
      minimum: 0,
    },
    {
      id: "switchCurrentA",
      kind: "number",
      label: "Switch current",
      unit: "A",
      minimum: 0,
    },
    {
      id: "voltageRiseTimeS",
      kind: "number",
      label: "Voltage transition time",
      unit: "s",
      minimum: 0,
    },
    {
      id: "currentFallTimeS",
      kind: "number",
      label: "Current transition time",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "switchingEnergyJ",
      kind: "number",
      label: "Approximate switching energy",
      unit: "J",
    },
  ],
  calculate: (input) =>
    calculateIgbtSwitchingEnergy({
      busVoltageV: input.busVoltageV as number,
      switchCurrentA: input.switchCurrentA as number,
      voltageRiseTimeS: input.voltageRiseTimeS as number,
      currentFallTimeS: input.currentFallTimeS as number,
    }),
});
export const igbtSwitchingEnergyTool = tool;
export const runIgbtSwitchingEnergy = tool.execute;
export default tool;
