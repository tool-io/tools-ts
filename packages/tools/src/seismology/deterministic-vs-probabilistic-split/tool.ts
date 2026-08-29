import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const deterministicVsProbabilisticSplitGuideExample = {
  input: { hasActiveFaultModel: true, hasRecurrenceData: false },
  output: {
    recommendation: "DSHA-leaning hybrid",
    rationale:
      "Faults are characterized but recurrence is weak; use scenario events with sensitivity bounds.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const deterministicVsProbabilisticSplitGuideTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ hasActiveFaultModel, hasRecurrenceData }) => {
      if (hasActiveFaultModel && hasRecurrenceData)
        return {
          recommendation: "PSHA (with deterministic checks)",
          rationale:
            "Both source characterization and recurrence statistics support a probabilistic hazard integral.",
        };
      if (hasActiveFaultModel)
        return {
          recommendation: "DSHA-leaning hybrid",
          rationale:
            "Faults are characterized but recurrence is weak; use scenario events with sensitivity bounds.",
        };
      if (hasRecurrenceData)
        return {
          recommendation: "PSHA with area sources",
          rationale:
            "Catalog statistics allow smoothed-seismicity or area-source modeling without mapped faults.",
        };
      return {
        recommendation: "Preliminary deterministic screen only",
        rationale:
          "Insufficient data for any formal hazard analysis; commission fault mapping and catalog compilation.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Recommend DSHA or PSHA based on available fault characterization and recurrence data.",
  id: "seismology/deterministic-vs-probabilistic-split",
  inputs: [
    {
      description: "Identified active faults with slip rates?",
      id: "hasActiveFaultModel",
      kind: "boolean",
      label: "Fault model",
    },
    {
      description: "Recurrence/catalog statistics available?",
      id: "hasRecurrenceData",
      kind: "boolean",
      label: "Recurrence",
    },
  ],
  outputs: [
    {
      description: "Recommended analysis framework.",
      id: "recommendation",
      kind: "string",
      label: "Approach",
    },
    {
      description: "Rationale for the recommendation.",
      id: "rationale",
      kind: "string",
      label: "Why",
    },
  ],
  title: "Deterministic vs Probabilistic Split Guide",
});
export const runDeterministicVsProbabilisticSplitGuide =
  deterministicVsProbabilisticSplitGuideTool.execute;
export { deterministicVsProbabilisticSplitGuideExample as example };
export default deterministicVsProbabilisticSplitGuideTool;
