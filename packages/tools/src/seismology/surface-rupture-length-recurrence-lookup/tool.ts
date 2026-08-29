import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const surfaceRuptureLengthRecurrenceLookupExample = {
  input: { magnitudeMw: 7 },
  output: {
    ruptureReachesSurface: true,
    expectedSRLKm: 57.33096629695036,
    bandNote: "rare great surface-rupturing event",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const surfaceRuptureLengthRecurrenceLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw }) => {
      if (magnitudeMw < 5.5)
        return {
          ruptureReachesSurface: false,
          expectedSRLKm: 0,
          bandNote: "usually no surface rupture",
        };
      const srl = Math.pow(10, (magnitudeMw - 4.38) / 1.49);
      return {
        ruptureReachesSurface: true,
        expectedSRLKm: srl,
        bandNote:
          magnitudeMw >= 7
            ? "rare great surface-rupturing event"
            : "moderate to major surface rupture",
      };
    })(input as never) as Record<string, unknown>,
  description: "Classify expected surface-rupture behavior by magnitude band.",
  id: "seismology/surface-rupture-length-recurrence-lookup",
  inputs: [
    {
      description: "Event magnitude.",
      id: "magnitudeMw",
      kind: "number",
      label: "M",
    },
  ],
  outputs: [
    {
      description: "Whether surface rupture is expected.",
      id: "ruptureReachesSurface",
      kind: "boolean",
      label: "Surfaces?",
    },
    {
      description: "Wells-Coppersmith style expected rupture length.",
      id: "expectedSRLKm",
      kind: "number",
      label: "SRL",
      unit: "km",
    },
    {
      description: "Magnitude band classification.",
      id: "bandNote",
      kind: "string",
      label: "Band",
    },
  ],
  title: "Surface Rupture Length Scaling Lookup",
});
export const runSurfaceRuptureLengthRecurrenceLookup =
  surfaceRuptureLengthRecurrenceLookupTool.execute;
export { surfaceRuptureLengthRecurrenceLookupExample as example };
export default surfaceRuptureLengthRecurrenceLookupTool;
