import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermoelectricFigureOfMeritZtInput = Readonly<{
  readonly seebeckVoltsPerKelvin: number;
  readonly electricalSiemensPerMeter: number;
  readonly temperatureKelvin: number;
  readonly thermalWattsPerMeterKelvin: number;
}>;
export type ThermoelectricFigureOfMeritZtOutput = Readonly<{
  readonly zt: number;
}>;

export const calculateThermoelectricFigureOfMeritZt = (
  x: ThermoelectricFigureOfMeritZtInput,
): ThermoelectricFigureOfMeritZtOutput => {
  if (!Number.isFinite(x.seebeckVoltsPerKelvin))
    simpleError("seebeckVoltsPerKelvin", "Provide a finite number.");
  if (
    !Number.isFinite(x.electricalSiemensPerMeter) ||
    x.electricalSiemensPerMeter < 0
  )
    simpleError(
      "electricalSiemensPerMeter",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.temperatureKelvin) || x.temperatureKelvin < 0)
    simpleError("temperatureKelvin", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.thermalWattsPerMeterKelvin) ||
    x.thermalWattsPerMeterKelvin < 0
  )
    simpleError(
      "thermalWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  const zt =
    (x.seebeckVoltsPerKelvin ** 2 *
      x.electricalSiemensPerMeter *
      x.temperatureKelvin) /
    x.thermalWattsPerMeterKelvin;
  if (!Number.isFinite(zt))
    simpleError("zt", "Inputs produce an undefined or out-of-range result.");
  return { zt: Object.is(zt, -0) ? 0 : zt };
};

export const example = {
  input: {
    seebeckVoltsPerKelvin: 0.0002,
    electricalSiemensPerMeter: 100000,
    temperatureKelvin: 300,
    thermalWattsPerMeterKelvin: 1,
  },
  output: { zt: 1.2 },
} satisfies ToolExample<
  ThermoelectricFigureOfMeritZtInput,
  ThermoelectricFigureOfMeritZtOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/thermoelectric-figure-of-merit-zt",
  title: "Thermoelectric Figure Of Merit Zt",
  description:
    "Dimensionless thermoelectric figure of merit ZT=S²σT/κ using SI Seebeck coefficient, conductivity and thermal conductivity.",
  inputs: [
    {
      id: "seebeckVoltsPerKelvin",
      kind: "number",
      label: "Seebeck Volts Per Kelvin",
      unit: "V/K",
    },
    {
      id: "electricalSiemensPerMeter",
      kind: "number",
      label: "Electrical Siemens Per Meter",
      unit: "S/m",
      minimum: 0,
    },
    {
      id: "temperatureKelvin",
      kind: "number",
      label: "Temperature Kelvin",
      unit: "K",
      minimum: 0,
    },
    {
      id: "thermalWattsPerMeterKelvin",
      kind: "number",
      label: "Thermal Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
  ],
  outputs: [{ id: "zt", kind: "number", label: "Zt" }],
  calculate: (input) =>
    calculateThermoelectricFigureOfMeritZt({
      seebeckVoltsPerKelvin: input.seebeckVoltsPerKelvin as number,
      electricalSiemensPerMeter: input.electricalSiemensPerMeter as number,
      temperatureKelvin: input.temperatureKelvin as number,
      thermalWattsPerMeterKelvin: input.thermalWattsPerMeterKelvin as number,
    }),
});
export const thermoelectricFigureOfMeritZtTool = tool;
export const runThermoelectricFigureOfMeritZt = tool.execute;
export default tool;
