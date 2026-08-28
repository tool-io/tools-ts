import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrainGaugeFactorInput = {
  readonly gaugeFactorNumber?: number;
  readonly nominalOhms: number;
  readonly strainEpsilon: number;
};

export type StrainGaugeFactorOutput = {
  readonly resistanceChangeOhms: number;
};

export const strainGaugeFactorExample = {
  input: { nominalOhms: 120, strainEpsilon: 0.001 },
  output: { resistanceChangeOhms: 0.24 },
} satisfies ToolExample<StrainGaugeFactorInput, StrainGaugeFactorOutput>;

export const calculateStrainGaugeFactor = (
  input: StrainGaugeFactorInput,
): StrainGaugeFactorOutput => {
  if (!(input.nominalOhms > 0))
    simpleError(
      "nominalOhms",
      "Nominal resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.strainEpsilon >= 0) || !(input.strainEpsilon <= 0.01))
    simpleError(
      "strainEpsilon",
      "Strain must be between zero and 0.01.",
      "invalid_strain",
    );
  const gaugeFactor = input.gaugeFactorNumber ?? 2;
  if (!(gaugeFactor >= 0) || !(gaugeFactor <= 200))
    simpleError(
      "gaugeFactorNumber",
      "Gauge factor must be between zero and 200.",
      "invalid_gauge_factor",
    );
  return {
    resistanceChangeOhms: gaugeFactor * input.nominalOhms * input.strainEpsilon,
  };
};

export const strainGaugeFactorTool = createSimpleTool({
  calculate: (input) =>
    calculateStrainGaugeFactor(input as unknown as StrainGaugeFactorInput),
  description:
    "Compute the resistance change of a strain gauge from its gauge factor, nominal resistance, and strain.",
  id: "electronics/strain-gauge-factor",
  inputs: [
    {
      description: "Unstrained resistance of the gauge.",
      format: "resistance",
      id: "nominalOhms",
      kind: "number",
      label: "Nominal resistance",
      unit: "Ω",
    },
    {
      description: "Mechanical strain as a fractional elongation.",
      id: "strainEpsilon",
      kind: "number",
      label: "Strain",
      maximum: 0.01,
      minimum: 0,
    },
    {
      default: 2,
      description:
        "Gauge factor relating strain to fractional resistance change.",
      id: "gaugeFactorNumber",
      kind: "number",
      label: "Gauge factor",
      maximum: 200,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Signed magnitude of the resistance change.",
      format: "resistance",
      id: "resistanceChangeOhms",
      kind: "number",
      label: "Resistance change",
      unit: "Ω",
    },
  ],
  title: "Strain Gauge Resistance Change",
});
export const runStrainGaugeFactor = strainGaugeFactorTool.execute;
export default strainGaugeFactorTool;
