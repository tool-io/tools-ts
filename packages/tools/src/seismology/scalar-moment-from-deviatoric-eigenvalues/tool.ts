import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const scalarMomentFromDeviatoricEigenvaluesExample = {
  input: {
    eigenvalue1Nm: 150000000000000000,
    eigenvalue2Nm: 0,
    eigenvalue3Nm: -150000000000000000,
  },
  output: {
    scalarMomentNm: 150000000000000000,
    equivalentMw: 5.384060839370454,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const scalarMomentFromDeviatoricEigenvaluesTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eigenvalue1Nm, eigenvalue2Nm, eigenvalue3Nm }) => {
      const sse =
        (eigenvalue1Nm ** 2 + eigenvalue2Nm ** 2 + eigenvalue3Nm ** 2) / 2;
      const m0 = Math.sqrt(sse);
      if (!(m0 > 0))
        simpleError(
          "eigenvalue1Nm",
          "At least one eigenvalue must be nonzero.",
        );
      return {
        scalarMomentNm: m0,
        equivalentMw: (2 / 3) * (Math.log10(m0) - 9.1),
      };
    })(input as never) as Record<string, unknown>,
  description: "Scalar seismic moment from tensor eigenvalues: M̄ = √(Σλᵢ²/2).",
  id: "seismology/scalar-moment-from-deviatoric-eigenvalues",
  inputs: [
    {
      description: "First eigenvalue.",
      id: "eigenvalue1Nm",
      kind: "number",
      label: "λ₁",
      unit: "N·m",
    },
    {
      description: "Second eigenvalue.",
      id: "eigenvalue2Nm",
      kind: "number",
      label: "λ₂",
      unit: "N·m",
    },
    {
      description: "Third eigenvalue.",
      id: "eigenvalue3Nm",
      kind: "number",
      label: "λ₃",
      unit: "N·m",
    },
  ],
  outputs: [
    {
      description: "Scalar moment.",
      id: "scalarMomentNm",
      kind: "number",
      label: "M̄",
      unit: "N·m",
    },
    {
      description: "Magnitude equivalent of the scalar moment.",
      id: "equivalentMw",
      kind: "number",
      label: "M_w",
    },
  ],
  title: "Scalar Moment From Deviatoric Eigenvalues Calculator",
});
export const runScalarMomentFromDeviatoricEigenvalues =
  scalarMomentFromDeviatoricEigenvaluesTool.execute;
export { scalarMomentFromDeviatoricEigenvaluesExample as example };
export default scalarMomentFromDeviatoricEigenvaluesTool;
