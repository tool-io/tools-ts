import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const codaDurationMagnitudeNuttliFormulaExample = {
  input: {
    codaDurationSeconds: 120,
    distanceKm: 100,
    coefficientA: 2,
    coefficientB: 1,
    coefficientC: 0.003,
  },
  output: { durationMagnitudeMd: 4.379181246047625 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const codaDurationMagnitudeNuttliFormulaTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({
      codaDurationSeconds,
      distanceKm,
      coefficientA,
      coefficientB,
      coefficientC,
    }) => {
      if (!(codaDurationSeconds > 0))
        simpleError("codaDurationSeconds", "Coda duration must be positive.");
      return {
        durationMagnitudeMd:
          (coefficientA ?? 2.0) +
          (coefficientB ?? 1.0) * Math.log10(codaDurationSeconds) +
          (coefficientC ?? 0.003) * distanceKm,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Nuttli-style coda-duration magnitude M_d = a + b·log₁₀(τ) + c·Δ with regional coefficients.",
  id: "seismology/coda-duration-magnitude-nuttli-formula",
  inputs: [
    {
      minimum: 0,
      description: "Signal duration to coda end.",
      id: "codaDurationSeconds",
      kind: "number",
      label: "τ",
      unit: "s",
    },
    {
      minimum: 0,
      description: "Epicentral distance.",
      id: "distanceKm",
      kind: "number",
      label: "Δ",
      unit: "km",
    },
    {
      default: 2,
      description: "Intercept coefficient.",
      id: "coefficientA",
      kind: "number",
      label: "a",
    },
    {
      default: 1,
      description: "Log-duration slope.",
      id: "coefficientB",
      kind: "number",
      label: "b",
    },
    {
      default: 0.003,
      description: "Distance term.",
      id: "coefficientC",
      kind: "number",
      label: "c",
    },
  ],
  outputs: [
    {
      description: "Coda duration magnitude.",
      id: "durationMagnitudeMd",
      kind: "number",
      label: "M_d",
    },
  ],
  title: "Coda Duration Magnitude Nuttli Formula Calculator",
});
export const runCodaDurationMagnitudeNuttliFormula =
  codaDurationMagnitudeNuttliFormulaTool.execute;
export { codaDurationMagnitudeNuttliFormulaExample as example };
export default codaDurationMagnitudeNuttliFormulaTool;
