import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const polarographyHalfWavePotentialExample = {
  input: {
    electronCountInt: 1,
    limitingCurrentMA: 2,
    measuredPotentialVolts: -0.5,
    sampleCurrentMA: 1,
  },
  output: { halfWavePotentialVolts: -0.5 },
} satisfies ToolExample<
  {
    readonly electronCountInt: number;
    readonly limitingCurrentMA: number;
    readonly measuredPotentialVolts: number;
    readonly sampleCurrentMA: number;
  },
  { readonly halfWavePotentialVolts: number }
>;

export const polarographyHalfWavePotentialTool = createSimpleTool({
  id: "chemistry/polarography-half-wave-potential",
  title: "Half-Wave Potential",
  description:
    "Determine the reversible polarographic half-wave potential at 25 °C from a measured wave point using E₁/₂ = E - (0.0592/n)·log10((i_d-i)/i).",
  inputs: [
    {
      id: "measuredPotentialVolts",
      label: "Measured potential",
      kind: "number",
      unit: "V",
    },
    {
      id: "electronCountInt",
      label: "Electrons transferred",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "sampleCurrentMA",
      label: "Sample current",
      kind: "number",
      unit: "mA",
    },
    {
      id: "limitingCurrentMA",
      label: "Diffusion-limited current",
      kind: "number",
      unit: "mA",
    },
  ],
  outputs: [
    {
      id: "halfWavePotentialVolts",
      label: "Half wave potential",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const measuredPotentialVolts = input.measuredPotentialVolts as number;
    const electronCountInt = input.electronCountInt as number;
    const sampleCurrentMA = input.sampleCurrentMA as number;
    const limitingCurrentMA = input.limitingCurrentMA as number;
    if (!(sampleCurrentMA > 0))
      simpleError("sampleCurrentMA", "Sample current must be positive.");
    if (!(limitingCurrentMA > sampleCurrentMA))
      simpleError(
        "limitingCurrentMA",
        "Limiting current must be greater than the sample current.",
        "invalid_current_range",
      );
    return {
      halfWavePotentialVolts:
        measuredPotentialVolts -
        (0.0592 / electronCountInt) *
          Math.log10((limitingCurrentMA - sampleCurrentMA) / sampleCurrentMA),
    };
  },
});
export const runPolarographyHalfWavePotential =
  polarographyHalfWavePotentialTool.execute;
export default polarographyHalfWavePotentialTool;
