import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const catalogMagnitudeTypeHistogramSummaryExample = {
  input: { magnitudeTypes: ["ML", "ml", "MW", "mb", "Ms", "?"] },
  output: { mlCount: 2, mbCount: 1, msCount: 1, mwCount: 1, otherCount: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const catalogMagnitudeTypeHistogramSummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeTypes }) => {
      const xs = magnitudeTypes as unknown[];
      if (!Array.isArray(xs))
        simpleError("magnitudeTypes", "Provide type list.");
      const c = {
        mlCount: 0,
        mbCount: 0,
        msCount: 0,
        mwCount: 0,
        otherCount: 0,
      };
      for (const raw of xs as string[]) {
        const k = String(raw).toLowerCase();
        const key = {
          ml: "mlCount",
          mb: "mbCount",
          ms: "msCount",
          mw: "mwCount",
        }[k];
        if (key) (c as Record<string, number>)[key]++;
        else c.otherCount++;
      }
      return c;
    })(input as never) as Record<string, unknown>,
  description:
    "Count catalog magnitudes by reported type (ml, mb, ms, mw, other).",
  id: "seismology/catalog-magnitude-type-histogram-summary",
  inputs: [
    {
      description: "Magnitude type per event (case-insensitive).",
      id: "magnitudeTypes",
      kind: "stringList",
      label: "types",
    },
  ],
  outputs: [
    {
      description: "Local magnitude count.",
      id: "mlCount",
      kind: "integer",
      label: "M_L",
    },
    {
      description: "Body-wave count.",
      id: "mbCount",
      kind: "integer",
      label: "m_b",
    },
    {
      description: "Surface-wave count.",
      id: "msCount",
      kind: "integer",
      label: "M_s",
    },
    {
      description: "Moment count.",
      id: "mwCount",
      kind: "integer",
      label: "M_w",
    },
    {
      description: "Unrecognized types.",
      id: "otherCount",
      kind: "integer",
      label: "other",
    },
  ],
  title: "Catalog Magnitude Type Histogram Summary",
});
export const runCatalogMagnitudeTypeHistogramSummary =
  catalogMagnitudeTypeHistogramSummaryTool.execute;
export { catalogMagnitudeTypeHistogramSummaryExample as example };
export default catalogMagnitudeTypeHistogramSummaryTool;
