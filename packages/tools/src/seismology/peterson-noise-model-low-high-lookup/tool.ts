import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const petersonNoiseModelLowHighLookupExample = {
  input: { periodSeconds: 1 },
  output: { nlnmDb: -171, nhnmDb: -121 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const petersonNoiseModelLowHighLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ periodSeconds }) => {
      if (!(periodSeconds > 0))
        simpleError("periodSeconds", "Period must be positive.");
      const anchors: Array<[number, number, number]> = [
        [0.1, -140, -92],
        [0.22, -155, -108],
        [1, -171, -121],
        [3, -181, -128],
        [6, -186, -131],
        [15, -180, -133],
        [40, -172, -130],
        [100, -162, -123],
        [300, -149, -112],
        [1000, -132, -95],
      ];
      const lt = Math.log10(periodSeconds);
      if (periodSeconds <= anchors[0][0])
        return { nlnmDb: anchors[0][1], nhnmDb: anchors[0][2] };
      const last = anchors[anchors.length - 1];
      if (periodSeconds >= last[0]) return { nlnmDb: last[1], nhnmDb: last[2] };
      for (let i = 1; i < anchors.length; i++) {
        if (lt <= Math.log10(anchors[i][0])) {
          const lo = anchors[i - 1];
          const w =
            (lt - Math.log10(lo[0])) /
            (Math.log10(anchors[i][0]) - Math.log10(lo[0]));
          return {
            nlnmDb: lo[1] + w * (anchors[i][1] - lo[1]),
            nhnmDb: lo[2] + w * (anchors[i][2] - lo[2]),
          };
        }
      }
      return { nlnmDb: last[1], nhnmDb: last[2] };
    })(input as never) as Record<string, unknown>,
  description:
    "Approximate NLNM/NHNM acceleration power (dB relative to 1 (m/s²)²/Hz) at a period, log-linearly interpolated from a reduced set of Peterson (1993) anchors.",
  id: "seismology/peterson-noise-model-low-high-lookup",
  inputs: [
    {
      minimum: 0,
      description: "Period.",
      id: "periodSeconds",
      kind: "number",
      label: "T",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "New low-noise model power.",
      id: "nlnmDb",
      kind: "number",
      label: "NLNM",
      unit: "dB",
    },
    {
      description: "New high-noise model power.",
      id: "nhnmDb",
      kind: "number",
      label: "NHNM",
      unit: "dB",
    },
  ],
  title: "Peterson Noise Model Low High Lookup",
});
export const runPetersonNoiseModelLowHighLookup =
  petersonNoiseModelLowHighLookupTool.execute;
export { petersonNoiseModelLowHighLookupExample as example };
export default petersonNoiseModelLowHighLookupTool;
