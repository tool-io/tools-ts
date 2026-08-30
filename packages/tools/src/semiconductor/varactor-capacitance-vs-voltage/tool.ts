import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VaractorCapacitanceVsVoltageInput = Readonly<{
  readonly zeroBiasFarads: number;
  readonly reverseVolts: number;
  readonly builtInVolts: number;
  readonly gradingExponent: number;
}>;
export type VaractorCapacitanceVsVoltageOutput = Readonly<{
  readonly capacitanceFarads: number;
}>;

export const calculateVaractorCapacitanceVsVoltage = (
  x: VaractorCapacitanceVsVoltageInput,
): VaractorCapacitanceVsVoltageOutput => {
  if (!Number.isFinite(x.zeroBiasFarads) || x.zeroBiasFarads < 0)
    simpleError("zeroBiasFarads", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.reverseVolts) || x.reverseVolts < 0)
    simpleError("reverseVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.builtInVolts) || x.builtInVolts < 0)
    simpleError("builtInVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.gradingExponent) || x.gradingExponent < 0)
    simpleError("gradingExponent", "Provide a finite number at least 0.");
  const capacitanceFarads =
    x.zeroBiasFarads /
    (1 + x.reverseVolts / x.builtInVolts) ** x.gradingExponent;
  if (!Number.isFinite(capacitanceFarads))
    simpleError(
      "capacitanceFarads",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    capacitanceFarads: Object.is(capacitanceFarads, -0) ? 0 : capacitanceFarads,
  };
};

export const example = {
  input: {
    zeroBiasFarads: 1e-12,
    reverseVolts: 3,
    builtInVolts: 1,
    gradingExponent: 0.5,
  },
  output: { capacitanceFarads: 5e-13 },
} satisfies ToolExample<
  VaractorCapacitanceVsVoltageInput,
  VaractorCapacitanceVsVoltageOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/varactor-capacitance-vs-voltage",
  title: "Varactor Capacitance Vs Voltage",
  description:
    "Junction varactor capacitance from zero-bias capacitance, built-in voltage and supplied junction grading exponent.",
  inputs: [
    {
      id: "zeroBiasFarads",
      kind: "number",
      label: "Zero Bias Farads",
      unit: "F",
      minimum: 0,
    },
    {
      id: "reverseVolts",
      kind: "number",
      label: "Reverse Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "builtInVolts",
      kind: "number",
      label: "Built In Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "gradingExponent",
      kind: "number",
      label: "Grading Exponent",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "capacitanceFarads",
      kind: "number",
      label: "Capacitance Farads",
      unit: "F",
    },
  ],
  calculate: (input) =>
    calculateVaractorCapacitanceVsVoltage({
      zeroBiasFarads: input.zeroBiasFarads as number,
      reverseVolts: input.reverseVolts as number,
      builtInVolts: input.builtInVolts as number,
      gradingExponent: input.gradingExponent as number,
    }),
});
export const varactorCapacitanceVsVoltageTool = tool;
export const runVaractorCapacitanceVsVoltage = tool.execute;
export default tool;
