import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const galvanometerDamping0707LookupExample = {
  input: { dampingRatio: 0.707 },
  output: { regime: "underdamped", maximallyFlat: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const galvanometerDamping0707LookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ dampingRatio }) => {
      const regime =
        dampingRatio < 0.9
          ? "underdamped"
          : dampingRatio <= 1.1
            ? "near-critical"
            : "overdamped";
      return {
        regime,
        maximallyFlat: Math.abs(dampingRatio - Math.SQRT1_2) <= 0.02,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Classify instrument damping against the maximally-flat ζ = 0.707 benchmark.",
  id: "seismology/galvanometer-damping-0707-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Damping ratio.",
      id: "dampingRatio",
      kind: "number",
      label: "ζ",
    },
  ],
  outputs: [
    {
      description: "Under/critical/over-damped classification.",
      id: "regime",
      kind: "string",
      label: "Regime",
    },
    {
      description: "Whether ζ matches the 0.707 benchmark within 2%.",
      id: "maximallyFlat",
      kind: "boolean",
      label: "Flat",
    },
  ],
  title: "Galvanometer Damping 0707 Lookup",
});
export const runGalvanometerDamping0707Lookup =
  galvanometerDamping0707LookupTool.execute;
export { galvanometerDamping0707LookupExample as example };
export default galvanometerDamping0707LookupTool;
