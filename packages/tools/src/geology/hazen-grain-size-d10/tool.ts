import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HazenGrainSizeD10Input = {
  readonly hydraulicConductivityCmPerS: number;
  readonly hazenCoefficientPerCmS: number;
};

export type HazenGrainSizeD10Output = {
  readonly effectiveGrainSizeCm: number;
};

export const calculateHazenGrainSizeD10 = (
  input: HazenGrainSizeD10Input,
): HazenGrainSizeD10Output => {
  if (!(input.hydraulicConductivityCmPerS > 0))
    simpleError(
      "hydraulicConductivityCmPerS",
      "Hydraulic conductivity must be greater than zero.",
      "invalid_conductivity",
    );
  if (!(input.hazenCoefficientPerCmS > 0))
    simpleError(
      "hazenCoefficientPerCmS",
      "Hazen coefficient must be greater than zero.",
      "invalid_coefficient",
    );
  return {
    effectiveGrainSizeCm: Math.sqrt(
      input.hydraulicConductivityCmPerS / input.hazenCoefficientPerCmS,
    ),
  };
};

export const hazenGrainSizeD10Example = {
  input: { hydraulicConductivityCmPerS: 0.01, hazenCoefficientPerCmS: 100 },
  output: { effectiveGrainSizeCm: 0.01 },
} satisfies ToolExample<HazenGrainSizeD10Input, HazenGrainSizeD10Output>;

export const hazenGrainSizeD10Tool = createSimpleTool({
  id: "geology/hazen-grain-size-d10",
  title: "Hazen Grain Size D10 Calculator",
  description:
    "Invert the Hazen formula K = C * D10^2 to estimate the effective grain size D10 in centimeters from hydraulic conductivity in cm/s and the Hazen coefficient in 1/(cm*s).",
  inputs: [
    {
      description: "Hydraulic conductivity in centimeters per second.",
      id: "hydraulicConductivityCmPerS",
      kind: "number",
      label: "K",
    },
    {
      description: "Hazen coefficient C in reciprocal centimeter seconds.",
      id: "hazenCoefficientPerCmS",
      kind: "number",
      label: "C",
    },
  ],
  outputs: [
    {
      description: "Effective grain size D10 in centimeters.",
      id: "effectiveGrainSizeCm",
      kind: "number",
      label: "D10",
    },
  ],
  calculate: (input) =>
    calculateHazenGrainSizeD10(input as unknown as HazenGrainSizeD10Input),
});

export const runHazenGrainSizeD10 = hazenGrainSizeD10Tool.execute;
export default hazenGrainSizeD10Tool;
