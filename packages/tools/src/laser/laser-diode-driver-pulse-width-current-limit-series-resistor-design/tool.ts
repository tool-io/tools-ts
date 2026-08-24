import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DriverSeriesResistorInput = {
  readonly supplyVoltageV: number;
  readonly forwardVoltageV: number;
  readonly targetCurrentMa: number;
  readonly dutyCyclePercent?: number;
};

export type DriverSeriesResistorOutput = {
  readonly seriesResistanceOhms: number;
  readonly peakResistorPowerWatts: number;
  readonly averageResistorPowerWatts: number;
  readonly averageCurrentMa: number;
};

export const designDriverSeriesResistor = (
  input: DriverSeriesResistorInput,
): DriverSeriesResistorOutput => {
  const duty = (input.dutyCyclePercent ?? 100) / 100;
  if (input.targetCurrentMa <= 0)
    simpleError("targetCurrentMa", "Target current must be positive.");
  if (!(duty > 0 && duty <= 1))
    simpleError(
      "dutyCyclePercent",
      "Duty cycle must be greater than zero and at most 100 percent.",
    );
  if (input.supplyVoltageV <= 0)
    simpleError("supplyVoltageV", "Supply voltage must be positive.");
  if (input.forwardVoltageV < 0)
    simpleError("forwardVoltageV", "Forward voltage cannot be negative.");
  if (input.forwardVoltageV >= input.supplyVoltageV)
    simpleError(
      "supplyVoltageV",
      "Supply voltage must exceed the diode forward voltage; add headroom for the series resistor.",
      "insufficient_headroom",
    );
  const amps = input.targetCurrentMa / 1000;
  const ohms = (input.supplyVoltageV - input.forwardVoltageV) / amps;
  return {
    seriesResistanceOhms: ohms,
    peakResistorPowerWatts: amps * amps * ohms,
    averageResistorPowerWatts: amps * amps * ohms * duty,
    averageCurrentMa: input.targetCurrentMa * duty,
  };
};

export const driverSeriesResistorExample = {
  input: {
    supplyVoltageV: 5,
    forwardVoltageV: 2,
    targetCurrentMa: 50,
    dutyCyclePercent: 10,
  },
  output: (() => {
    const amps = 50 / 1000;
    const ohms = (5 - 2) / amps;
    return {
      seriesResistanceOhms: ohms,
      peakResistorPowerWatts: amps * amps * ohms,
      averageResistorPowerWatts: amps * amps * ohms * 0.1,
      averageCurrentMa: 50 * 0.1,
    };
  })(),
} satisfies ToolExample<DriverSeriesResistorInput, DriverSeriesResistorOutput>;

export const driverSeriesResistorTool = createSimpleTool({
  calculate: (input) =>
    designDriverSeriesResistor({
      dutyCyclePercent: input.dutyCyclePercent as number,
      forwardVoltageV: input.forwardVoltageV as number,
      supplyVoltageV: input.supplyVoltageV as number,
      targetCurrentMa: input.targetCurrentMa as number,
    }),
  description:
    "Size the series resistor for a simple laser-diode driver, including pulsed-duty power and average current.",
  id: "laser/laser-diode-driver-pulse-width-current-limit-series-resistor-design",
  inputs: [
    {
      description: "Driver supply rail.",
      id: "supplyVoltageV",
      kind: "number",
      label: "Supply",
      unit: "V",
    },
    {
      description: "Diode forward voltage at the target current.",
      id: "forwardVoltageV",
      kind: "number",
      label: "V_forward",
      unit: "V",
    },
    {
      description: "Desired peak drive current.",
      id: "targetCurrentMa",
      kind: "number",
      label: "Target current",
      minimum: 0,
      unit: "mA",
    },
    {
      default: 100,
      description: "Pulse duty cycle of the drive.",
      id: "dutyCyclePercent",
      kind: "number",
      label: "Duty cycle",
      maximum: 100,
      minimum: 1,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Series resistance that sets the peak current.",
      id: "seriesResistanceOhms",
      kind: "number",
      label: "R_series",
      unit: "Ω",
    },
    {
      description: "Resistor dissipation while the diode is on.",
      id: "peakResistorPowerWatts",
      kind: "number",
      label: "Peak resistor power",
      unit: "W",
    },
    {
      description: "Resistor dissipation averaged over the duty cycle.",
      id: "averageResistorPowerWatts",
      kind: "number",
      label: "Average resistor power",
      unit: "W",
    },
    {
      description: "Mean current over the pulse period.",
      id: "averageCurrentMa",
      kind: "number",
      label: "Average current",
      unit: "mA",
    },
  ],
  title: "Diode Series-Resistor Driver Design",
});
export const runDriverSeriesResistor = driverSeriesResistorTool.execute;
export default driverSeriesResistorTool;

export { driverSeriesResistorExample as example };
