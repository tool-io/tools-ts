import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolaronEffectiveMassInput = {
  readonly bareMassRatio: number;
  readonly frohlichAlpha: number;
};

export type PolaronEffectiveMassOutput = {
  readonly polaronMassRatio: number;
};

export const calculatePolaronEffectiveMass = (
  input: PolaronEffectiveMassInput,
): PolaronEffectiveMassOutput => {
  if (!Number.isFinite(input.bareMassRatio) || input.bareMassRatio <= 0)
    simpleError("bareMassRatio", "Bare mass ratio must be positive.");
  if (
    !Number.isFinite(input.frohlichAlpha) ||
    input.frohlichAlpha < 0 ||
    input.frohlichAlpha > 1
  )
    simpleError(
      "frohlichAlpha",
      "Frohlich alpha must be between zero and one for this weak-coupling expansion.",
      "outside_weak_coupling",
    );
  return {
    polaronMassRatio:
      input.bareMassRatio *
      (1 + input.frohlichAlpha / 6 + 0.025 * input.frohlichAlpha ** 2),
  };
};

export const polaronEffectiveMassExample = {
  input: { bareMassRatio: 0.067, frohlichAlpha: 0.068 },
  output: { polaronMassRatio: 0.06776707853333334 },
} satisfies ToolExample<PolaronEffectiveMassInput, PolaronEffectiveMassOutput>;

export const polaronEffectiveMassTool = createSimpleTool({
  calculate: (input) => {
    return calculatePolaronEffectiveMass({
      bareMassRatio: input.bareMassRatio as number,
      frohlichAlpha: input.frohlichAlpha as number,
    });
  },
  description:
    "Estimate the Fröhlich polaron effective mass with the second-order weak-coupling expansion mₚ/m*=1+α/6+0.025α², restricted to α≤1.",
  id: "semiconductor/polaron-effective-mass",
  inputs: [
    {
      description: "Bare band effective mass ratio.",
      format: "ratio",
      id: "bareMassRatio",
      kind: "number",
      label: "Bare mass ratio",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Frohlich coupling constant.",
      id: "frohlichAlpha",
      kind: "number",
      label: "Frohlich alpha",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Polaron effective mass ratio.",
      format: "ratio",
      id: "polaronMassRatio",
      kind: "number",
      label: "Polaron mass ratio",
    },
  ],
  title: "Polaron Effective Mass Calculator",
});
export const runPolaronEffectiveMass = polaronEffectiveMassTool.execute;
export default polaronEffectiveMassTool;
