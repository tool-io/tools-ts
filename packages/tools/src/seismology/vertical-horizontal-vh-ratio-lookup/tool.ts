import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const verticalHorizontalVhRatioLookupExample = {
  input: { periodSeconds: 0.3 },
  output: { vhRatio: 0.6, band: "short period" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const verticalHorizontalVhRatioLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ periodSeconds }) => {
      if (periodSeconds < 0.15)
        return { vhRatio: 0.9, band: "very short period" };
      if (periodSeconds < 0.5) return { vhRatio: 0.6, band: "short period" };
      if (periodSeconds < 2)
        return { vhRatio: 0.4, band: "intermediate period" };
      return { vhRatio: 0.3, band: "long period" };
    })(input as never) as Record<string, unknown>,
  description: "Typical vertical-to-horizontal spectral ratio by period band.",
  id: "seismology/vertical-horizontal-vh-ratio-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Spectral period.",
      id: "periodSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Vertical/horizontal amplitude ratio.",
      id: "vhRatio",
      kind: "number",
      label: "V/H",
    },
    {
      description: "Period band note.",
      id: "band",
      kind: "string",
      label: "Band",
    },
  ],
  title: "Vertical Horizontal VH Ratio Lookup",
});
export const runVerticalHorizontalVhRatioLookup =
  verticalHorizontalVhRatioLookupTool.execute;
export { verticalHorizontalVhRatioLookupExample as example };
export default verticalHorizontalVhRatioLookupTool;
