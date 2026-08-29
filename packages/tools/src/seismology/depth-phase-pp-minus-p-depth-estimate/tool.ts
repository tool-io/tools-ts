import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const depthPhasePpMinusPDepthEstimateExample = {
  input: { ppMinusPSeconds: 10 },
  output: {
    focalDepthKm: 34,
    confidenceNote:
      "Assumes surface reflection; topography and velocity structure bias the estimate.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const depthPhasePpMinusPDepthEstimateTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ ppMinusPSeconds, averageVelocityKmS }) => {
      if (averageVelocityKmS <= 0)
        simpleError("averageVelocityKmS", "Average velocity must be positive.");
      return {
        focalDepthKm: (ppMinusPSeconds * averageVelocityKmS) / 2,
        confidenceNote:
          "Assumes surface reflection; topography and velocity structure bias the estimate.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Crustal depth from the pP−P time assuming a surface bounce: h ≈ Δt·v̄/2.",
  id: "seismology/depth-phase-pp-minus-p-depth-estimate",
  inputs: [
    {
      minimum: 0,
      description: "Observed pP−P delay.",
      id: "ppMinusPSeconds",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
    {
      default: 6.8,
      minimum: 0,
      description: "Mean upper-mantle P speed.",
      id: "averageVelocityKmS",
      kind: "number",
      label: "v̄",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Approximate focal depth.",
      id: "focalDepthKm",
      kind: "number",
      label: "h",
      unit: "km",
    },
    {
      description: "Method confidence note.",
      id: "confidenceNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Depth Phase PP Minus P Depth Estimate",
});
export const runDepthPhasePpMinusPDepthEstimate =
  depthPhasePpMinusPDepthEstimateTool.execute;
export { depthPhasePpMinusPDepthEstimateExample as example };
export default depthPhasePpMinusPDepthEstimateTool;
