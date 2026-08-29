import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const responseSpectrumCornerPeriodBandLookupExample = {
  input: { magnitudeMw: 7 },
  output: {
    accelerationBandS: [0.2, 0.8],
    velocityCornerS: 1.5,
    bandNote: "large event, long-period shifted shape",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const responseSpectrumCornerPeriodBandLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudeMw }) => {
      if (magnitudeMw < 5)
        return {
          accelerationBandS: [0.05, 0.2],
          velocityCornerS: 0.35,
          bandNote: "small event, hard-rock-like shape",
        };
      if (magnitudeMw < 6.5)
        return {
          accelerationBandS: [0.1, 0.4],
          velocityCornerS: 0.7,
          bandNote: "moderate event, typical engineering band",
        };
      return {
        accelerationBandS: [0.2, 0.8],
        velocityCornerS: 1.5,
        bandNote: "large event, long-period shifted shape",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Acceleration- and velocity-controlled period bands scaled by magnitude class.",
  id: "seismology/response-spectrum-corner-period-band-lookup",
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
      description: "Acceleration-controlled period band.",
      id: "accelerationBandS",
      kind: "numberList",
      label: "T_acc",
      unit: "s",
    },
    {
      description: "Velocity corner period.",
      id: "velocityCornerS",
      kind: "number",
      label: "T_v",
      unit: "s",
    },
    {
      description: "Magnitude class note.",
      id: "bandNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Response Spectrum Corner Period Band Lookup",
});
export const runResponseSpectrumCornerPeriodBandLookup =
  responseSpectrumCornerPeriodBandLookupTool.execute;
export { responseSpectrumCornerPeriodBandLookupExample as example };
export default responseSpectrumCornerPeriodBandLookupTool;
