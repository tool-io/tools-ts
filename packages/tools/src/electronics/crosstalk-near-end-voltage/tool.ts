import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrosstalkNearEndVoltageInput = Readonly<{
  readonly aggressorVoltageV: number;
  readonly nearEndCouplingFraction: number;
}>;
export type CrosstalkNearEndVoltageOutput = Readonly<{
  nearEndVoltageV: number;
}>;

export const calculateCrosstalkNearEndVoltage = (
  i: CrosstalkNearEndVoltageInput,
): CrosstalkNearEndVoltageOutput => {
  const value = i.aggressorVoltageV * i.nearEndCouplingFraction;
  if (!Number.isFinite(value))
    simpleError("nearEndVoltageV", "The inputs produce a non-finite result.");
  return { nearEndVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { aggressorVoltageV: 5, nearEndCouplingFraction: 0.02 },
  output: { nearEndVoltageV: 0.1 },
} satisfies ToolExample<
  CrosstalkNearEndVoltageInput,
  CrosstalkNearEndVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/crosstalk-near-end-voltage",
  title: "Crosstalk Near End Voltage",
  description:
    "Estimate near-end crosstalk voltage from a measured or specified dimensionless near-end coupling coefficient and aggressor voltage; this is not a cable-geometry prediction.",
  inputs: [
    {
      id: "aggressorVoltageV",
      kind: "number",
      label: "Aggressor (V)",
      unit: "V",
    },
    {
      id: "nearEndCouplingFraction",
      kind: "number",
      label: "Near End Coupling Fraction",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    { id: "nearEndVoltageV", kind: "number", label: "Near End (V)", unit: "V" },
  ],
  calculate: (input) =>
    calculateCrosstalkNearEndVoltage({
      aggressorVoltageV: input.aggressorVoltageV as number,
      nearEndCouplingFraction: input.nearEndCouplingFraction as number,
    }),
});
export const crosstalkNearEndVoltageTool = tool;
export const runCrosstalkNearEndVoltage = tool.execute;
export default tool;
