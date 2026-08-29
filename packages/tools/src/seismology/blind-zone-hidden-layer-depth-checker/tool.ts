import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const blindZoneHiddenLayerDepthCheckerExample = {
  input: { velocitiesMS: [1500, 2500, 4500] },
  output: { hiddenLayerIndices: [], profileTrustworthy: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const blindZoneHiddenLayerDepthCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ velocitiesMS }) => {
      const vs = velocitiesMS as unknown[];
      if (!Array.isArray(vs) || vs.length < 2)
        simpleError("velocitiesMS", "Provide at least two layers.");
      const arr = vs as number[];
      if (arr.some((velocity) => velocity <= 0))
        simpleError("velocitiesMS", "Layer velocities must be positive.");
      const hiddenLayerIndices: number[] = [];
      let fastestOverburden = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] <= fastestOverburden) hiddenLayerIndices.push(i);
        fastestOverburden = Math.max(fastestOverburden, arr[i]);
      }
      return {
        hiddenLayerIndices,
        profileTrustworthy: hiddenLayerIndices.length === 0,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Flag layers that cannot produce a critically refracted first arrival because their velocity does not exceed every overlying layer velocity.",
  id: "seismology/blind-zone-hidden-layer-depth-checker",
  inputs: [
    {
      description: "Layer velocities top-down.",
      id: "velocitiesMS",
      kind: "numberList",
      label: "V_i",
    },
  ],
  outputs: [
    {
      description:
        "Zero-based indices of potential low-velocity or equal-velocity hidden layers.",
      id: "hiddenLayerIndices",
      kind: "numberList",
      label: "Hidden",
    },
    {
      description:
        "Whether velocity increases strictly with depth; this is necessary, but not sufficient, for every interface to be resolved.",
      id: "profileTrustworthy",
      kind: "boolean",
      label: "Trustworthy",
    },
  ],
  title: "Blind Zone Hidden Layer Depth Checker",
});
export const runBlindZoneHiddenLayerDepthChecker =
  blindZoneHiddenLayerDepthCheckerTool.execute;
export { blindZoneHiddenLayerDepthCheckerExample as example };
export default blindZoneHiddenLayerDepthCheckerTool;
