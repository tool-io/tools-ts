import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const catalogCompleteTimespanDenominatorCheckerExample = {
  input: { firstYear: 1980, lastYear: 2025 },
  output: {
    spanYears: 46,
    adequateForRates: true,
    note: "Short spans inflate annual-rate variance; consider completeness-based trimming.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const catalogCompleteTimespanDenominatorCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ firstYear, lastYear }) => {
      if (lastYear < firstYear)
        simpleError("lastYear", "End year precedes start year.");
      const spanYears = lastYear - firstYear + 1;
      return {
        spanYears,
        adequateForRates: spanYears >= 30,
        note: "Short spans inflate annual-rate variance; consider completeness-based trimming.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Verify the catalog window is long enough for stable annual-rate denominators.",
  id: "seismology/catalog-complete-timespan-denominator-checker",
  inputs: [
    {
      description: "First complete year.",
      id: "firstYear",
      kind: "number",
      label: "y₀",
    },
    {
      description: "Last complete year.",
      id: "lastYear",
      kind: "number",
      label: "y₁",
    },
  ],
  outputs: [
    {
      description: "Complete span length.",
      id: "spanYears",
      kind: "number",
      label: "Δt",
      unit: "yr",
    },
    {
      description: "Whether the span exceeds 30 years.",
      id: "adequateForRates",
      kind: "boolean",
      label: "Adequate?",
    },
    {
      description: "Guidance.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Catalog Complete Timespan Denominator Checker",
});
export const runCatalogCompleteTimespanDenominatorChecker =
  catalogCompleteTimespanDenominatorCheckerTool.execute;
export { catalogCompleteTimespanDenominatorCheckerExample as example };
export default catalogCompleteTimespanDenominatorCheckerTool;
