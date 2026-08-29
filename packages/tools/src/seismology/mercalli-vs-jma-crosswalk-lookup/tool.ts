import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const mercalliVsJmaCrosswalkLookupExample = {
  input: { jmaIntensity: 4 },
  output: { mmiLow: 5, mmiHigh: 6, descriptor: "rather strong" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const mercalliVsJmaCrosswalkLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ jmaIntensity }) => {
      const bands = [
        { max: 0.5, lo: 1, hi: 2, d: "imperceptible" },
        { max: 1.5, lo: 2, hi: 3, d: "slight" },
        { max: 2.5, lo: 3, hi: 4, d: "weak" },
        { max: 3.5, lo: 4, hi: 5, d: "moderate" },
        { max: 4.5, lo: 5, hi: 6, d: "rather strong" },
        { max: 5.5, lo: 6, hi: 7, d: "strong" },
        { max: 6.5, lo: 7, hi: 8, d: "destructive" },
      ];
      const b = bands.find((x) => jmaIntensity <= x.max) ?? {
        lo: 9,
        hi: 10,
        d: "devastating",
      };
      return { mmiLow: b.lo, mmiHigh: b.hi, descriptor: b.d };
    })(input as never) as Record<string, unknown>,
  description:
    "Crosswalk between JMA instrumental scale and equivalent MMI range.",
  id: "seismology/mercalli-vs-jma-crosswalk-lookup",
  inputs: [
    {
      minimum: 0,
      maximum: 7,
      description: "JMA intensity.",
      id: "jmaIntensity",
      kind: "number",
      label: "I_JMA",
    },
  ],
  outputs: [
    {
      description: "Lower bound MMI equivalent.",
      id: "mmiLow",
      kind: "number",
      label: "MMI low",
    },
    {
      description: "Upper bound MMI equivalent.",
      id: "mmiHigh",
      kind: "number",
      label: "MMI high",
    },
    {
      description: "Shaking descriptor.",
      id: "descriptor",
      kind: "string",
      label: "Descriptor",
    },
  ],
  title: "Mercalli vs JMA Crosswalk Lookup",
});
export const runMercalliVsJmaCrosswalkLookup =
  mercalliVsJmaCrosswalkLookupTool.execute;
export { mercalliVsJmaCrosswalkLookupExample as example };
export default mercalliVsJmaCrosswalkLookupTool;
