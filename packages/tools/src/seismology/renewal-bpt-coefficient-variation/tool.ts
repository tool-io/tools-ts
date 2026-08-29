import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const renewalBptCoefficientVariationExample = {
  input: { meanIntervalYears: 200, stdDevYears: 80 },
  output: { coefficientVariation: 0.4, processClass: "intermediate" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const renewalBptCoefficientVariationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ meanIntervalYears, stdDevYears }) => {
      if (meanIntervalYears <= 0)
        simpleError("meanIntervalYears", "Mean interval must be positive.");
      const alpha = stdDevYears / meanIntervalYears;
      return {
        coefficientVariation: alpha,
        processClass:
          alpha < 0.3
            ? "quasi-periodic"
            : alpha <= 0.7
              ? "intermediate"
              : "clustered/Poisson-like",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Brownian Passage Time coefficient of variation α = σ/μ and its relation to aperiodicity.",
  id: "seismology/renewal-bpt-coefficient-variation",
  inputs: [
    {
      minimum: 0,
      description: "Mean recurrence interval.",
      id: "meanIntervalYears",
      kind: "number",
      label: "μ",
      unit: "yr",
    },
    {
      minimum: 0,
      description: "Standard deviation of intervals.",
      id: "stdDevYears",
      kind: "number",
      label: "σ",
      unit: "yr",
    },
  ],
  outputs: [
    {
      description: "Aperiodicity parameter σ/μ.",
      id: "coefficientVariation",
      kind: "number",
      label: "α",
    },
    {
      description: "Quasi-periodic vs clustered classification.",
      id: "processClass",
      kind: "string",
      label: "Class",
    },
  ],
  title: "Renewal BPT Coefficient Variation Calculator",
});
export const runRenewalBptCoefficientVariation =
  renewalBptCoefficientVariationTool.execute;
export { renewalBptCoefficientVariationExample as example };
export default renewalBptCoefficientVariationTool;
