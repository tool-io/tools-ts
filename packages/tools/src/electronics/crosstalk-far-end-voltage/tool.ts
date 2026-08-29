import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrosstalkFarEndVoltageInput = Readonly<{
  readonly aggressorVoltageV: number;
  readonly farEndCouplingFraction: number;
}>;
export type CrosstalkFarEndVoltageOutput = Readonly<{ farEndVoltageV: number }>;

export const calculateCrosstalkFarEndVoltage = (
  i: CrosstalkFarEndVoltageInput,
): CrosstalkFarEndVoltageOutput => {
  const value = i.aggressorVoltageV * i.farEndCouplingFraction;
  if (!Number.isFinite(value))
    simpleError("farEndVoltageV", "The inputs produce a non-finite result.");
  return { farEndVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { aggressorVoltageV: 5, farEndCouplingFraction: 0.005 },
  output: { farEndVoltageV: 0.025 },
} satisfies ToolExample<
  CrosstalkFarEndVoltageInput,
  CrosstalkFarEndVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/crosstalk-far-end-voltage",
  title: "Crosstalk Far End Voltage",
  description:
    "Estimate far-end crosstalk voltage from a measured or specified dimensionless far-end coupling coefficient and aggressor voltage; this is not a cable-geometry prediction.",
  inputs: [
    {
      id: "aggressorVoltageV",
      kind: "number",
      label: "Aggressor (V)",
      unit: "V",
    },
    {
      id: "farEndCouplingFraction",
      kind: "number",
      label: "Far End Coupling Fraction",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "farEndVoltageV", kind: "number", label: "Far End (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateCrosstalkFarEndVoltage({
      aggressorVoltageV: input.aggressorVoltageV as number,
      farEndCouplingFraction: input.farEndCouplingFraction as number,
    }),
});
export const crosstalkFarEndVoltageTool = tool;
export const runCrosstalkFarEndVoltage = tool.execute;
export default tool;
