import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PoissonRatioInput = Readonly<{
  readonly transverseStrain: number;
  readonly axialStrain: number;
}>;
export type PoissonRatioOutput = Readonly<{
  readonly poissonRatio: number;
}>;

export const calculatePoissonRatio = (
  x: PoissonRatioInput,
): PoissonRatioOutput => {
  if (!Number.isFinite(x.transverseStrain))
    simpleError("transverseStrain", "Provide a finite number.");
  if (!Number.isFinite(x.axialStrain))
    simpleError("axialStrain", "Provide a finite number.");
  const poissonRatio = -x.transverseStrain / x.axialStrain;
  if (!Number.isFinite(poissonRatio))
    simpleError(
      "poissonRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { poissonRatio: Object.is(poissonRatio, -0) ? 0 : poissonRatio };
};

export const example = {
  input: { transverseStrain: -0.0003, axialStrain: 0.001 },
  output: { poissonRatio: 0.3 },
} satisfies ToolExample<PoissonRatioInput, PoissonRatioOutput>;

export const tool = createSimpleTool({
  id: "engineering/poisson-ratio",
  title: "Poisson Ratio",
  description:
    "Poisson ratio from signed transverse and axial strains under uniaxial loading, using ν=−εtransverse/εaxial.",
  inputs: [
    { id: "transverseStrain", kind: "number", label: "Transverse Strain" },
    { id: "axialStrain", kind: "number", label: "Axial Strain" },
  ],
  outputs: [{ id: "poissonRatio", kind: "number", label: "Poisson Ratio" }],
  calculate: (input) =>
    calculatePoissonRatio({
      transverseStrain: input.transverseStrain as number,
      axialStrain: input.axialStrain as number,
    }),
});
export const poissonRatioTool = tool;
export const runPoissonRatio = tool.execute;
export default tool;
