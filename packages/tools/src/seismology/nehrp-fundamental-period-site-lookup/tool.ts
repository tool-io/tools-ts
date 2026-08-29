import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nehrpFundamentalPeriodSiteLookupExample = {
  input: { siteClass: "D", profileDepthM: 30 },
  output: { fundamentalPeriodS: 0.4 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const nehrpFundamentalPeriodSiteLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ siteClass, profileDepthM }) => {
      const typicalVs = { A: 2500, B: 1500, C: 700, D: 300, E: 150 }[siteClass];
      if (typicalVs === undefined)
        simpleError("siteClass", "Unknown NEHRP class.");
      if (!(profileDepthM > 0))
        simpleError("profileDepthM", "Profile depth must be positive.");
      return { fundamentalPeriodS: (4 * profileDepthM) / typicalVs };
    })(input as never) as Record<string, unknown>,
  description:
    "Site fundamental period Ts = 4H/Vs from a NEHRP class-typical profile depth and velocity.",
  id: "seismology/nehrp-fundamental-period-site-lookup",
  inputs: [
    {
      description: "NEHRP site class letter.",
      enum: ["A", "B", "C", "D", "E"],
      id: "siteClass",
      kind: "string",
      label: "Class",
    },
    {
      default: 30,
      description: "Profile depth to bedrock.",
      id: "profileDepthM",
      kind: "number",
      label: "H",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Site fundamental period.",
      id: "fundamentalPeriodS",
      kind: "number",
      label: "T_s",
      unit: "s",
    },
  ],
  title: "NEHRP Fundamental Period Site Lookup",
});
export const runNehrpFundamentalPeriodSiteLookup =
  nehrpFundamentalPeriodSiteLookupTool.execute;
export { nehrpFundamentalPeriodSiteLookupExample as example };
export default nehrpFundamentalPeriodSiteLookupTool;
