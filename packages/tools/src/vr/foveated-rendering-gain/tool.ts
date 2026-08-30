import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FoveatedRenderingGainInput = Readonly<{
  readonly fullResolutionPixelWork: number;
  readonly foveatedPixelWork: number;
}>;
export type FoveatedRenderingGainOutput = Readonly<{
  readonly pixelWorkReductionFactor: number;
}>;

export const calculateFoveatedRenderingGain = (
  x: FoveatedRenderingGainInput,
): FoveatedRenderingGainOutput => {
  if (
    !Number.isFinite(x.fullResolutionPixelWork) ||
    x.fullResolutionPixelWork <= 0
  )
    simpleError("fullResolutionPixelWork", "Provide a finite positive number.");
  if (!Number.isFinite(x.foveatedPixelWork) || x.foveatedPixelWork <= 0)
    simpleError("foveatedPixelWork", "Provide a finite positive number.");
  if (!(x.foveatedPixelWork <= x.fullResolutionPixelWork))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pixelWorkReductionFactor =
    x.fullResolutionPixelWork / x.foveatedPixelWork;
  if (!Number.isFinite(pixelWorkReductionFactor))
    simpleError(
      "pixelWorkReductionFactor",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pixelWorkReductionFactor: Object.is(pixelWorkReductionFactor, -0)
      ? 0
      : pixelWorkReductionFactor,
  };
};

export const example = {
  input: {
    fullResolutionPixelWork: 1000000,
    foveatedPixelWork: 500000,
  },
  output: { pixelWorkReductionFactor: 2 },
} satisfies ToolExample<
  FoveatedRenderingGainInput,
  FoveatedRenderingGainOutput
>;

export const tool = createSimpleTool({
  id: "vr/foveated-rendering-gain",
  title: "Foveated Rendering Gain",
  description:
    "Ideal pixel-work reduction factor from full-resolution pixel workload divided by foveated workload; not measured FPS gain.",
  inputs: [
    {
      id: "fullResolutionPixelWork",
      kind: "number",
      label: "Full Resolution Pixel Work",
      unit: "pixels",
      minimum: 0,
    },
    {
      id: "foveatedPixelWork",
      kind: "number",
      label: "Foveated Pixel Work",
      unit: "pixels",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pixelWorkReductionFactor",
      kind: "number",
      label: "Pixel Work Reduction Factor",
    },
  ],
  calculate: (input) =>
    calculateFoveatedRenderingGain({
      fullResolutionPixelWork: input.fullResolutionPixelWork as number,
      foveatedPixelWork: input.foveatedPixelWork as number,
    }),
});
export const foveatedRenderingGainTool = tool;
export const runFoveatedRenderingGain = tool.execute;
export default tool;
