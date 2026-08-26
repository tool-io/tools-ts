import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ld50ProbitExample = {
  input: { intercept: 3, slope: 2 },
  output: { ld50Estimate: 10 },
} satisfies ToolExample<
  { readonly intercept: number; readonly slope: number },
  { readonly ld50Estimate: number }
>;

export const ld50ProbitTool = createSimpleTool({
  id: "biology/ld50-probit",
  title: "Probit LD50 Estimate",
  description:
    "Calculate LD50 from a fitted probit-5 model of the form probit = intercept + slope × log10(dose). Fifty percent response is probit 5, so LD50 = 10^((5 − intercept)/slope).",
  inputs: [
    {
      description:
        "Intercept of the fitted probit-5 regression at log10(dose) zero.",
      id: "intercept",
      label: "Probit intercept",
      kind: "number",
    },
    {
      description: "Positive slope of probit response against log10(dose).",
      id: "slope",
      label: "Probit slope",
      kind: "number",
    },
  ],
  outputs: [
    {
      description:
        "Estimated dose that produces a response in half the population.",
      id: "ld50Estimate",
      label: "LD50 estimate",
      kind: "number",
      unit: "mg/kg",
    },
  ],
  calculate: (input) => {
    const slope = input.slope as number;
    if (!(slope > 0))
      simpleError(
        "slope",
        "The probit slope must be greater than zero.",
        "invalid_slope",
      );
    const ld50Estimate = Math.pow(
      10,
      (5 - (input.intercept as number)) / slope,
    );
    if (!Number.isFinite(ld50Estimate))
      simpleError(
        "intercept",
        "The fitted coefficients produce an LD50 outside the finite numeric range.",
        "non_finite_estimate",
      );
    return { ld50Estimate };
  },
});
export const runLd50Probit = ld50ProbitTool.execute;
export default ld50ProbitTool;
