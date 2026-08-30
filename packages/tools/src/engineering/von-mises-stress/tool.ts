import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VonMisesStressInput = Readonly<{
  readonly sigmaXPascals: number;
  readonly sigmaYPascals: number;
  readonly tauXYPascals: number;
}>;
export type VonMisesStressOutput = Readonly<{
  readonly equivalentPascals: number;
}>;

export const calculateVonMisesStress = (
  x: VonMisesStressInput,
): VonMisesStressOutput => {
  if (!Number.isFinite(x.sigmaXPascals))
    simpleError("sigmaXPascals", "Provide a finite number.");
  if (!Number.isFinite(x.sigmaYPascals))
    simpleError("sigmaYPascals", "Provide a finite number.");
  if (!Number.isFinite(x.tauXYPascals))
    simpleError("tauXYPascals", "Provide a finite number.");
  const equivalentPascals = Math.sqrt(
    x.sigmaXPascals ** 2 -
      x.sigmaXPascals * x.sigmaYPascals +
      x.sigmaYPascals ** 2 +
      3 * x.tauXYPascals ** 2,
  );
  if (!Number.isFinite(equivalentPascals))
    simpleError(
      "equivalentPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    equivalentPascals: Object.is(equivalentPascals, -0) ? 0 : equivalentPascals,
  };
};

export const example = {
  input: { sigmaXPascals: 100000000, sigmaYPascals: 0, tauXYPascals: 0 },
  output: { equivalentPascals: 100000000 },
} satisfies ToolExample<VonMisesStressInput, VonMisesStressOutput>;

export const tool = createSimpleTool({
  id: "engineering/von-mises-stress",
  title: "Von Mises Stress",
  description:
    "Plane-stress von Mises equivalent stress from σx, σy and in-plane shear stress τxy.",
  inputs: [
    {
      id: "sigmaXPascals",
      kind: "number",
      label: "Sigma XPascals",
      unit: "Pa",
    },
    {
      id: "sigmaYPascals",
      kind: "number",
      label: "Sigma YPascals",
      unit: "Pa",
    },
    { id: "tauXYPascals", kind: "number", label: "Tau XYPascals", unit: "Pa" },
  ],
  outputs: [
    {
      id: "equivalentPascals",
      kind: "number",
      label: "Equivalent Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateVonMisesStress({
      sigmaXPascals: input.sigmaXPascals as number,
      sigmaYPascals: input.sigmaYPascals as number,
      tauXYPascals: input.tauXYPascals as number,
    }),
});
export const vonMisesStressTool = tool;
export const runVonMisesStress = tool.execute;
export default tool;
