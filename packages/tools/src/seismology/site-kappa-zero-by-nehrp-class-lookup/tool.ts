import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const siteKappaZeroByNehrpClassLookupExample = {
  input: { siteClass: "C" },
  output: {
    kappaLowSeconds: 0.03,
    kappaHighSeconds: 0.05,
    midpointSeconds: 0.04,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const siteKappaZeroByNehrpClassLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ siteClass }) => {
      const table = {
        A: [0.01, 0.02],
        B: [0.02, 0.04],
        C: [0.03, 0.05],
        D: [0.04, 0.06],
        E: [0.06, 0.09],
      }[siteClass];
      if (!table) simpleError("siteClass", "Unknown NEHRP class.");
      return {
        kappaLowSeconds: table[0],
        kappaHighSeconds: table[1],
        midpointSeconds: (table[0] + table[1]) / 2,
      };
    })(input as never) as Record<string, unknown>,
  description: "Typical near-surface kappa ranges by NEHRP site class.",
  id: "seismology/site-kappa-zero-by-nehrp-class-lookup",
  inputs: [
    {
      description: "NEHRP class A-E.",
      id: "siteClass",
      kind: "string",
      label: "Class",
    },
  ],
  outputs: [
    {
      description: "Low bound of typical kappa.",
      id: "kappaLowSeconds",
      kind: "number",
      label: "κ₀ lo",
      unit: "s",
    },
    {
      description: "High bound of typical kappa.",
      id: "kappaHighSeconds",
      kind: "number",
      label: "κ₀ hi",
      unit: "s",
    },
    {
      description: "Midpoint value.",
      id: "midpointSeconds",
      kind: "number",
      label: "κ₀ mid",
      unit: "s",
    },
  ],
  title: "Site Kappa Zero By NEHRP Class Lookup",
});
export const runSiteKappaZeroByNehrpClassLookup =
  siteKappaZeroByNehrpClassLookupTool.execute;
export { siteKappaZeroByNehrpClassLookupExample as example };
export default siteKappaZeroByNehrpClassLookupTool;
