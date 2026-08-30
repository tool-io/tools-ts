import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IgbtSaturationVoltageInput = Readonly<{
  readonly voltageInterceptV: number;
  readonly differentialResistanceOhm: number;
  readonly collectorCurrentA: number;
}>;
export type IgbtSaturationVoltageOutput = Readonly<{
  readonly saturationVoltageV: number;
}>;

export const calculateIgbtSaturationVoltage = (
  x: IgbtSaturationVoltageInput,
): IgbtSaturationVoltageOutput => {
  if (!Number.isFinite(x.voltageInterceptV) || x.voltageInterceptV < 0)
    simpleError("voltageInterceptV", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.differentialResistanceOhm) ||
    x.differentialResistanceOhm < 0
  )
    simpleError(
      "differentialResistanceOhm",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.collectorCurrentA) || x.collectorCurrentA < 0)
    simpleError("collectorCurrentA", "Provide a finite number at least 0.");
  const saturationVoltageV =
    x.voltageInterceptV + x.differentialResistanceOhm * x.collectorCurrentA;
  if (!Number.isFinite(saturationVoltageV))
    simpleError("saturationVoltageV", "The inputs produce an invalid result.");
  return {
    saturationVoltageV: Object.is(saturationVoltageV, -0)
      ? 0
      : saturationVoltageV,
  };
};

export const example = {
  input: {
    voltageInterceptV: 1,
    differentialResistanceOhm: 0.1,
    collectorCurrentA: 10,
  },
  output: { saturationVoltageV: 2 },
} satisfies ToolExample<
  IgbtSaturationVoltageInput,
  IgbtSaturationVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/igbt-saturation-voltage",
  title: "IGBT Saturation Voltage",
  description:
    "Estimate IGBT on-state collector-emitter saturation voltage from a calibrated intercept and differential on-resistance.",
  inputs: [
    {
      id: "voltageInterceptV",
      kind: "number",
      label: "On-state voltage intercept",
      unit: "V",
      minimum: 0,
    },
    {
      id: "differentialResistanceOhm",
      kind: "number",
      label: "Differential on-resistance",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "collectorCurrentA",
      kind: "number",
      label: "Collector current",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "saturationVoltageV",
      kind: "number",
      label: "Estimated VCE(sat)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateIgbtSaturationVoltage({
      voltageInterceptV: input.voltageInterceptV as number,
      differentialResistanceOhm: input.differentialResistanceOhm as number,
      collectorCurrentA: input.collectorCurrentA as number,
    }),
});
export const igbtSaturationVoltageTool = tool;
export const runIgbtSaturationVoltage = tool.execute;
export default tool;
