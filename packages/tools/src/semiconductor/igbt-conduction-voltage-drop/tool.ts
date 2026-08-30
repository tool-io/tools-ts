import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtConductionVoltageDropInput = Readonly<{
  readonly interceptVolts: number;
  readonly currentAmperes: number;
  readonly differentialOhms: number;
}>;
export type IgbtConductionVoltageDropOutput = Readonly<{
  readonly conductionVolts: number;
}>;

export const calculateIgbtConductionVoltageDrop = (
  x: IgbtConductionVoltageDropInput,
): IgbtConductionVoltageDropOutput => {
  if (!Number.isFinite(x.interceptVolts) || x.interceptVolts < 0)
    simpleError("interceptVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.currentAmperes) || x.currentAmperes < 0)
    simpleError("currentAmperes", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.differentialOhms) || x.differentialOhms < 0)
    simpleError("differentialOhms", "Provide a finite number at least 0.");
  const conductionVolts =
    x.interceptVolts + x.currentAmperes * x.differentialOhms;
  if (!Number.isFinite(conductionVolts))
    simpleError(
      "conductionVolts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    conductionVolts: Object.is(conductionVolts, -0) ? 0 : conductionVolts,
  };
};

export const example = {
  input: { interceptVolts: 1.2, currentAmperes: 10, differentialOhms: 0.05 },
  output: { conductionVolts: 1.7 },
} satisfies ToolExample<
  IgbtConductionVoltageDropInput,
  IgbtConductionVoltageDropOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/igbt-conduction-voltage-drop",
  title: "IGBT Conduction Voltage Drop",
  description:
    "Piecewise-linear IGBT on-state voltage estimate from intercept voltage and differential on-resistance at a given current.",
  inputs: [
    {
      id: "interceptVolts",
      kind: "number",
      label: "Intercept Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "currentAmperes",
      kind: "number",
      label: "Current Amperes",
      unit: "A",
      minimum: 0,
    },
    {
      id: "differentialOhms",
      kind: "number",
      label: "Differential Ohms",
      unit: "Ω",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "conductionVolts",
      kind: "number",
      label: "Conduction Volts",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateIgbtConductionVoltageDrop({
      interceptVolts: input.interceptVolts as number,
      currentAmperes: input.currentAmperes as number,
      differentialOhms: input.differentialOhms as number,
    }),
});
export const igbtConductionVoltageDropTool = tool;
export const runIgbtConductionVoltageDrop = tool.execute;
export default tool;
