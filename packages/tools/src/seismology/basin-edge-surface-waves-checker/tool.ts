import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const basinEdgeSurfaceWavesCheckerExample = {
  input: { vsBasinMS: 300, vsBedrockMS: 1200 },
  output: { contrastRatio: 4, edgeWavesLikely: true },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const basinEdgeSurfaceWavesCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ vsBasinMS, vsBedrockMS }) => {
      if (vsBasinMS <= 0)
        simpleError("vsBasinMS", "Basin Vs must be positive.");
      if (vsBedrockMS <= 0)
        simpleError("vsBedrockMS", "Bedrock Vs must be positive.");
      const contrastRatio = vsBedrockMS / vsBasinMS;
      return { contrastRatio, edgeWavesLikely: contrastRatio >= 2 };
    })(input as never) as Record<string, unknown>,
  description:
    "Screen whether the bedrock-to-basin shear-wave velocity contrast reaches an illustrative 2:1 threshold associated with stronger basin-edge effects; geometry is not modeled.",
  id: "seismology/basin-edge-surface-waves-checker",
  inputs: [
    {
      minimum: 0,
      description: "Basin fill shear velocity.",
      id: "vsBasinMS",
      kind: "number",
      label: "Vs,basin",
      unit: "m/s",
    },
    {
      minimum: 0,
      description: "Bedrock shear velocity.",
      id: "vsBedrockMS",
      kind: "number",
      label: "Vs,rock",
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Bedrock-to-basin velocity contrast.",
      id: "contrastRatio",
      kind: "number",
      label: "Vr/Vb",
    },
    {
      description: "Whether edge-generated surface waves are expected.",
      id: "edgeWavesLikely",
      kind: "boolean",
      label: "Likely",
    },
  ],
  title: "Basin Edge Surface Waves Checker",
});
export const runBasinEdgeSurfaceWavesChecker =
  basinEdgeSurfaceWavesCheckerTool.execute;
export { basinEdgeSurfaceWavesCheckerExample as example };
export default basinEdgeSurfaceWavesCheckerTool;
