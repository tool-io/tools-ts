import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MosfetThresholdVoltageInput = Readonly<{
  readonly zeroBiasThresholdV: number;
  readonly bodyCoefficientSqrtV: number;
  readonly twiceFermiPotentialV: number;
  readonly sourceBodyVoltageV: number;
}>;
export type MosfetThresholdVoltageOutput = Readonly<{
  readonly thresholdVoltageV: number;
}>;

export const calculateMosfetThresholdVoltage = (
  x: MosfetThresholdVoltageInput,
): MosfetThresholdVoltageOutput => {
  if (!Number.isFinite(x.zeroBiasThresholdV))
    simpleError("zeroBiasThresholdV", "Provide a finite number.");
  if (!Number.isFinite(x.bodyCoefficientSqrtV) || x.bodyCoefficientSqrtV < 0)
    simpleError("bodyCoefficientSqrtV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.twiceFermiPotentialV) || x.twiceFermiPotentialV < 0)
    simpleError("twiceFermiPotentialV", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sourceBodyVoltageV) || x.sourceBodyVoltageV < 0)
    simpleError("sourceBodyVoltageV", "Provide a finite number at least 0.");
  if (!(x.twiceFermiPotentialV > 0))
    simpleError("twiceFermiPotentialV", "Surface potential must be positive.");
  const thresholdVoltageV =
    x.zeroBiasThresholdV +
    x.bodyCoefficientSqrtV *
      (Math.sqrt(x.twiceFermiPotentialV + x.sourceBodyVoltageV) -
        Math.sqrt(x.twiceFermiPotentialV));
  if (!Number.isFinite(thresholdVoltageV))
    simpleError("thresholdVoltageV", "The inputs produce an invalid result.");
  return {
    thresholdVoltageV: Object.is(thresholdVoltageV, -0) ? 0 : thresholdVoltageV,
  };
};

export const example = {
  input: {
    zeroBiasThresholdV: 0.5,
    bodyCoefficientSqrtV: 0.4,
    twiceFermiPotentialV: 0.6,
    sourceBodyVoltageV: 0.3,
  },
  output: { thresholdVoltageV: 0.5696346515236121 },
} satisfies ToolExample<
  MosfetThresholdVoltageInput,
  MosfetThresholdVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/mosfet-threshold-voltage",
  title: "MOSFET Threshold Voltage",
  description:
    "Estimate nMOS threshold with body effect from zero-body-bias threshold, body coefficient, surface potential, and nonnegative source-to-body bias.",
  inputs: [
    {
      id: "zeroBiasThresholdV",
      kind: "number",
      label: "Threshold at zero body bias",
      unit: "V",
    },
    {
      id: "bodyCoefficientSqrtV",
      kind: "number",
      label: "Body coefficient",
      unit: "√V",
      minimum: 0,
    },
    {
      id: "twiceFermiPotentialV",
      kind: "number",
      label: "Twice Fermi potential",
      unit: "V",
      minimum: 0,
    },
    {
      id: "sourceBodyVoltageV",
      kind: "number",
      label: "Source-to-body bias",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "thresholdVoltageV",
      kind: "number",
      label: "Body-biased threshold",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateMosfetThresholdVoltage({
      zeroBiasThresholdV: input.zeroBiasThresholdV as number,
      bodyCoefficientSqrtV: input.bodyCoefficientSqrtV as number,
      twiceFermiPotentialV: input.twiceFermiPotentialV as number,
      sourceBodyVoltageV: input.sourceBodyVoltageV as number,
    }),
});
export const mosfetThresholdVoltageTool = tool;
export const runMosfetThresholdVoltage = tool.execute;
export default tool;
