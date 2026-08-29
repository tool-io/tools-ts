import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const schusterCriticalValueSignificanceCheckerExample = {
  input: { schusterZ: 2.5 },
  output: {
    confidenceLevelPercent: 99,
    significant: true,
    verdict: "tidal modulation claim survives the one-sided screen",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const schusterCriticalValueSignificanceCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ schusterZ }) => {
      const significant = Math.abs(schusterZ) >= 1.64;
      const confidenceLevelPercent =
        Math.abs(schusterZ) >= 3.09
          ? 99.9
          : Math.abs(schusterZ) >= 2.33
            ? 99
            : Math.abs(schusterZ) >= 1.64
              ? 95
              : Math.abs(schusterZ) >= 1.28
                ? 90
                : 80;
      return {
        confidenceLevelPercent,
        significant,
        verdict: significant
          ? "tidal modulation claim survives the one-sided screen"
          : "no evidence of tidal modulation at the 95 percent level",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Assess tidal-phase Schuster test significance from the standardized statistic z.",
  id: "seismology/schuster-critical-value-significance-checker",
  inputs: [
    {
      description: "(A_obs − A_mean)/σ statistic.",
      id: "schusterZ",
      kind: "number",
      label: "z",
    },
  ],
  outputs: [
    {
      description: "Highest one-sided confidence level reached.",
      id: "confidenceLevelPercent",
      kind: "number",
      label: "Level",
      unit: "%",
    },
    {
      description: "Whether the 95 percent threshold is met.",
      id: "significant",
      kind: "boolean",
      label: "Significant?",
    },
    {
      description: "Interpretation.",
      id: "verdict",
      kind: "string",
      label: "Verdict",
    },
  ],
  title: "Schuster Critical Value Significance Checker",
});
export const runSchusterCriticalValueSignificanceChecker =
  schusterCriticalValueSignificanceCheckerTool.execute;
export { schusterCriticalValueSignificanceCheckerExample as example };
export default schusterCriticalValueSignificanceCheckerTool;
