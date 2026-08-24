import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ApdBreakdownVoltageInput = {
  readonly referenceBreakdownVolts: number;
  readonly temperatureC: number;
};

export type ApdBreakdownVoltageOutput = {
  readonly breakdownAtTempVolts: number;
};

const TEMPCO_PER_CELSIUS = 0.0011;

export const apdBreakdownVoltageExample = {
  input: { referenceBreakdownVolts: 100, temperatureC: -40 },
  output: { breakdownAtTempVolts: 92.85 },
} satisfies ToolExample<ApdBreakdownVoltageInput, ApdBreakdownVoltageOutput>;

export const calculateApdBreakdownVoltage = (
  input: ApdBreakdownVoltageInput,
): ApdBreakdownVoltageOutput => {
  const referenceBreakdownVolts = input.referenceBreakdownVolts;
  const temperatureC = input.temperatureC;

  if (!Number.isFinite(referenceBreakdownVolts) || referenceBreakdownVolts <= 0)
    simpleError(
      "referenceBreakdownVolts",
      "Reference breakdown must be a finite positive number.",
      "invalid_reference_breakdown",
    );

  if (
    !Number.isFinite(temperatureC) ||
    temperatureC < -55 ||
    temperatureC > 175
  )
    simpleError(
      "temperatureC",
      "Temperature must be a finite number in [-55, 175] °C.",
      "invalid_temperature",
    );

  const factor = 1 + TEMPCO_PER_CELSIUS * (temperatureC - 25);
  const breakdownAtTempVolts = referenceBreakdownVolts * factor;

  if (!Number.isFinite(breakdownAtTempVolts))
    simpleError(
      "referenceBreakdownVolts",
      "Breakdown voltage could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );

  return {
    breakdownAtTempVolts: breakdownAtTempVolts === 0 ? 0 : breakdownAtTempVolts,
  };
};

export const apdBreakdownVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateApdBreakdownVoltage({
      referenceBreakdownVolts: input.referenceBreakdownVolts as number,
      temperatureC: input.temperatureC as number,
    }),
  description:
    "Shift an APD breakdown voltage to operating temperature using the linear temperature coefficient model V(T)=Vref·[1+0.0011·(T-25 °C)]. Valid for reference breakdown Vref>0 V defined at 25 °C and junction temperature T in [-55, 175] °C inclusive; outside this range the 0.11%/°C linear approximation degrades. Vref is the breakdown magnitude (positive, not signed). Result is the breakdown magnitude at temperature. Device-specific tempco may vary.",
  id: "semiconductor/apd-breakdown-voltage",
  inputs: [
    {
      description:
        "Breakdown voltage at the 25 °C reference. Must be greater than 0 V; magnitude only (signed voltages not supported).",
      id: "referenceBreakdownVolts",
      kind: "number",
      label: "Reference breakdown",
      minimum: Number.MIN_VALUE,
      unit: "V",
    },
    {
      description:
        "Junction temperature. Must be in [-55, 175] °C inclusive; linear model only.",
      id: "temperatureC",
      kind: "number",
      label: "Temperature",
      maximum: 175,
      minimum: -55,
      unit: "°C",
    },
  ],
  outputs: [
    {
      description:
        "Breakdown voltage at the requested temperature. At least 0 V; multiply by area or current for total power.",
      id: "breakdownAtTempVolts",
      kind: "number",
      label: "Breakdown at temperature",
      minimum: 0,
      unit: "V",
    },
  ],
  title: "APD Breakdown Voltage Temperature Shift Calculator",
});
export const runApdBreakdownVoltage = apdBreakdownVoltageTool.execute;
export default apdBreakdownVoltageTool;
