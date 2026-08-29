import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasSensorResistanceRatioInput = Readonly<{
  readonly sensorResistanceOhms: number;
  readonly referenceResistanceOhms: number;
}>;
export type GasSensorResistanceRatioOutput = Readonly<{
  resistanceRatio: number;
}>;

export const calculateGasSensorResistanceRatio = (
  i: GasSensorResistanceRatioInput,
): GasSensorResistanceRatioOutput => {
  const value = i.sensorResistanceOhms / i.referenceResistanceOhms;
  if (!Number.isFinite(value))
    simpleError("resistanceRatio", "The inputs produce a non-finite result.");
  return { resistanceRatio: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { sensorResistanceOhms: 12000, referenceResistanceOhms: 10000 },
  output: { resistanceRatio: 1.2 },
} satisfies ToolExample<
  GasSensorResistanceRatioInput,
  GasSensorResistanceRatioOutput
>;

export const tool = createSimpleTool({
  id: "electronics/gas-sensor-resistance-ratio",
  title: "Gas Sensor Resistance Ratio",
  description:
    "Calculate a resistive gas sensor's dimensionless resistance ratio Rs/R0 from measured sensor and reference resistances; gas concentration needs a separate calibrated curve.",
  inputs: [
    {
      id: "sensorResistanceOhms",
      kind: "number",
      label: "Sensor Resistance (Ω)",
      unit: "Ω",
      minimum: 0,
    },
    {
      id: "referenceResistanceOhms",
      kind: "number",
      label: "Reference Resistance (Ω)",
      unit: "Ω",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "resistanceRatio", kind: "number", label: "Resistance Ratio" },
  ],
  calculate: (input) =>
    calculateGasSensorResistanceRatio({
      sensorResistanceOhms: input.sensorResistanceOhms as number,
      referenceResistanceOhms: input.referenceResistanceOhms as number,
    }),
});
export const gasSensorResistanceRatioTool = tool;
export const runGasSensorResistanceRatio = tool.execute;
export default tool;
