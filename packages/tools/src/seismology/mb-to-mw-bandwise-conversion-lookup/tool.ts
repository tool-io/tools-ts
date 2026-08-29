import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const mbToMwBandwiseConversionLookupExample = {
  input: { mbMagnitude: 5.8 },
  output: {
    momentMagnitudeMw: 6.2,
    saturationNote: "bandwise linear regression adequate for this range",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const mbToMwBandwiseConversionLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ mbMagnitude }) => {
      if (mbMagnitude > 6.5)
        return {
          momentMagnitudeMw: mbMagnitude + 0.2,
          saturationNote: "mb saturates beyond ~6.5; prefer direct Mw.",
        };
      return {
        momentMagnitudeMw: mbMagnitude + 0.4,
        saturationNote: "bandwise linear regression adequate for this range",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Bandwise mb-to-Mw conversion with a saturation note above mb ≈ 6.5.",
  id: "seismology/mb-to-mw-bandwise-conversion-lookup",
  inputs: [
    {
      description: "Body-wave magnitude.",
      id: "mbMagnitude",
      kind: "number",
      label: "m_b",
    },
  ],
  outputs: [
    {
      description: "Converted moment magnitude.",
      id: "momentMagnitudeMw",
      kind: "number",
      label: "M_w",
    },
    {
      description: "Saturation guidance.",
      id: "saturationNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "MB To MW Bandwise Conversion Lookup",
});
export const runMbToMwBandwiseConversionLookup =
  mbToMwBandwiseConversionLookupTool.execute;
export { mbToMwBandwiseConversionLookupExample as example };
export default mbToMwBandwiseConversionLookupTool;
