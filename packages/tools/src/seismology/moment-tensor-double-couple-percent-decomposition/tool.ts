import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const momentTensorDoubleCouplePercentDecompositionExample = {
  input: { eigenvalueMax: 1, eigenvalueMid: 0, eigenvalueMin: -1 },
  output: { doubleCouplePercent: 100, clvdPercent: 0, isoPercent: 0 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const momentTensorDoubleCouplePercentDecompositionTool =
  createSimpleTool({
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ eigenvalueMax, eigenvalueMid, eigenvalueMin }) => {
        const tr = eigenvalueMax + eigenvalueMid + eigenvalueMin;
        const norm = Math.max(
          Math.abs(eigenvalueMax),
          Math.abs(eigenvalueMid),
          Math.abs(eigenvalueMin),
        );
        if (norm === 0)
          simpleError("eigenvalueMax", "Eigenvalues cannot all vanish.");
        const isotropicAmplitude = Math.abs(tr / 3);
        const deviatoric = [
          eigenvalueMax - tr / 3,
          eigenvalueMid - tr / 3,
          eigenvalueMin - tr / 3,
        ].sort((a, b) => b - a);
        const deviatoricAmplitude = Math.sqrt(
          deviatoric.reduce((sum, value) => sum + value * value, 0) / 2,
        );
        const totalAmplitude = isotropicAmplitude + deviatoricAmplitude;
        const isoFraction = isotropicAmplitude / totalAmplitude;
        if (deviatoricAmplitude === 0)
          return {
            doubleCouplePercent: 0,
            clvdPercent: 0,
            isoPercent: 100,
          };
        const maxDeviatoric = Math.max(
          Math.abs(deviatoric[0]),
          Math.abs(deviatoric[2]),
        );
        const clvdFractionWithinDeviatoric = Math.min(
          1,
          (2 * Math.abs(deviatoric[1])) / maxDeviatoric,
        );
        const deviatoricFraction = 1 - isoFraction;
        return {
          doubleCouplePercent:
            100 * deviatoricFraction * (1 - clvdFractionWithinDeviatoric),
          clvdPercent: 100 * deviatoricFraction * clvdFractionWithinDeviatoric,
          isoPercent: 100 * isoFraction,
        };
      })(input as never) as Record<string, unknown>,
    description:
      "Decompose ordered moment-tensor eigenvalues into isotropic and deviatoric amplitudes, then split the deviatoric share into double-couple and CLVD components; the three reported percentages sum to 100.",
    id: "seismology/moment-tensor-double-couple-percent-decomposition",
    inputs: [
      {
        description: "Largest principal eigenvalue (arbitrary units).",
        id: "eigenvalueMax",
        kind: "number",
        label: "λ₁",
      },
      {
        description: "Intermediate eigenvalue.",
        id: "eigenvalueMid",
        kind: "number",
        label: "λ₂",
      },
      {
        description: "Smallest eigenvalue.",
        id: "eigenvalueMin",
        kind: "number",
        label: "λ₃",
      },
    ],
    outputs: [
      {
        description: "Double-couple share of the deviatoric part.",
        id: "doubleCouplePercent",
        kind: "number",
        label: "DC%",
        unit: "%",
      },
      {
        description: "Compensated linear-vector dipole share.",
        id: "clvdPercent",
        kind: "number",
        label: "CLVD%",
        unit: "%",
      },
      {
        description: "Isotropic (trace) share of the full tensor.",
        id: "isoPercent",
        kind: "number",
        label: "ISO%",
        unit: "%",
      },
    ],
    title: "Moment Tensor Double Couple Percent Decomposition Calculator",
  });
export const runMomentTensorDoubleCouplePercentDecomposition =
  momentTensorDoubleCouplePercentDecompositionTool.execute;
export { momentTensorDoubleCouplePercentDecompositionExample as example };
export default momentTensorDoubleCouplePercentDecompositionTool;
