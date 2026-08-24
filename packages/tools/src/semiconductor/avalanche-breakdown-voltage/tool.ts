import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AvalancheBreakdownVoltageInput = {
  readonly criticalFieldMVPerCm: number;
  readonly depletionWidthUm: number;
};

export type AvalancheBreakdownVoltageOutput = {
  readonly breakdownVolts: number;
};

export const avalancheBreakdownVoltageExample = {
  input: { criticalFieldMVPerCm: 0.3, depletionWidthUm: 2 },
  output: { breakdownVolts: 30 },
} satisfies ToolExample<
  AvalancheBreakdownVoltageInput,
  AvalancheBreakdownVoltageOutput
>;

export const calculateAvalancheBreakdownVoltage = (
  input: AvalancheBreakdownVoltageInput,
): AvalancheBreakdownVoltageOutput => {
  const criticalFieldMVPerCm = input.criticalFieldMVPerCm;
  const depletionWidthUm = input.depletionWidthUm;

  if (!Number.isFinite(criticalFieldMVPerCm) || criticalFieldMVPerCm <= 0)
    simpleError(
      "criticalFieldMVPerCm",
      "Critical field must be a finite positive number.",
      "invalid_critical_field",
    );

  if (!Number.isFinite(depletionWidthUm) || depletionWidthUm <= 0)
    simpleError(
      "depletionWidthUm",
      "Depletion width must be a finite positive number.",
      "invalid_depletion_width",
    );

  // A one-sided abrupt junction has an approximately triangular field profile,
  // so the voltage is one half of peak field times depletion width.
  const directVoltage = criticalFieldMVPerCm * depletionWidthUm * 50;
  const breakdownVolts =
    Number.isFinite(directVoltage) && directVoltage > 0
      ? directVoltage
      : Math.exp(
          Math.log(criticalFieldMVPerCm) +
            Math.log(depletionWidthUm) +
            Math.log(50),
        );

  if (!Number.isFinite(breakdownVolts) || breakdownVolts === 0)
    simpleError(
      "criticalFieldMVPerCm",
      "Breakdown voltage is outside the representable positive range.",
      breakdownVolts === 0 ? "numeric_underflow" : "numeric_overflow",
    );

  return {
    breakdownVolts: breakdownVolts === 0 ? 0 : breakdownVolts,
  };
};

export const avalancheBreakdownVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: input.criticalFieldMVPerCm as number,
      depletionWidthUm: input.depletionWidthUm as number,
    }),
  description:
    "Estimate one-sided abrupt-junction avalanche breakdown voltage from the peak critical field and depletion width: Vb ≈ Ecrit·W/2. The factor 50 converts MV/cm·µm to volts and includes the triangular-field factor of one half. The estimate neglects curvature, edge termination, and the full ionization integral.",
  id: "semiconductor/avalanche-breakdown-voltage",
  inputs: [
    {
      description:
        "Critical electric field the junction sustains at breakdown. Must be greater than 0 MV/cm.",
      format: "electric-field-mv-per-cm",
      id: "criticalFieldMVPerCm",
      kind: "number",
      label: "Critical field",
      minimum: Number.MIN_VALUE,
      unit: "MV/cm",
    },
    {
      description: "Depletion width at breakdown. Must be greater than 0 µm.",
      format: "length-um",
      id: "depletionWidthUm",
      kind: "number",
      label: "Depletion width",
      minimum: Number.MIN_VALUE,
      unit: "um",
    },
  ],
  outputs: [
    {
      description: "Avalanche breakdown voltage (magnitude). At least 0 V.",
      format: "voltage-v",
      id: "breakdownVolts",
      kind: "number",
      label: "Breakdown voltage",
      minimum: 0,
      unit: "V",
    },
  ],
  title: "Avalanche Breakdown Voltage Calculator",
});
export const runAvalancheBreakdownVoltage =
  avalancheBreakdownVoltageTool.execute;
export default avalancheBreakdownVoltageTool;
