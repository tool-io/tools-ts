import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cumulativeMomentReleaseCatalogSummaryExample = {
  input: { momentsNm: [100000000000000000, 30000000000000000] },
  output: {
    totalMomentNm: 130000000000000000,
    equivalentMagnitudeMw: 5.342628901537891,
    eventCount: 2,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const cumulativeMomentReleaseCatalogSummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ momentsNm }) => {
      const xs = momentsNm as unknown[];
      if (!Array.isArray(xs) || xs.length === 0)
        simpleError("momentsNm", "Provide at least one moment.");
      if ((xs as number[]).some((moment) => moment <= 0))
        simpleError("momentsNm", "All seismic moments must be positive.");
      const total = (xs as number[]).reduce((a, b) => a + b, 0);
      return {
        totalMomentNm: total,
        equivalentMagnitudeMw: (2 / 3) * (Math.log10(total) - 9.1),
        eventCount: xs.length,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Total moment and equivalent single-event magnitude of an event list.",
  id: "seismology/cumulative-moment-release-catalog-summary",
  inputs: [
    {
      description: "Event seismic moments.",
      id: "momentsNm",
      kind: "numberList",
      label: "M₀ᵢ",
    },
  ],
  outputs: [
    {
      description: "Sum of moments.",
      id: "totalMomentNm",
      kind: "number",
      label: "ΣM₀",
      unit: "N·m",
    },
    {
      description: "Magnitude of the summed moment.",
      id: "equivalentMagnitudeMw",
      kind: "number",
      label: "M_w,eq",
    },
    {
      description: "Number of events.",
      id: "eventCount",
      kind: "integer",
      label: "N",
    },
  ],
  title: "Cumulative Moment Release Catalog Summary",
});
export const runCumulativeMomentReleaseCatalogSummary =
  cumulativeMomentReleaseCatalogSummaryTool.execute;
export { cumulativeMomentReleaseCatalogSummaryExample as example };
export default cumulativeMomentReleaseCatalogSummaryTool;
