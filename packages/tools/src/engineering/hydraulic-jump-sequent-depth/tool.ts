import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HydraulicJumpSequentDepthInput = Readonly<{
  readonly upstreamDepthMeters: number;
  readonly upstreamFroudeNumber: number;
}>;
export type HydraulicJumpSequentDepthOutput = Readonly<{
  readonly downstreamDepthMeters: number;
}>;

export const calculateHydraulicJumpSequentDepth = (
  x: HydraulicJumpSequentDepthInput,
): HydraulicJumpSequentDepthOutput => {
  if (!Number.isFinite(x.upstreamDepthMeters) || x.upstreamDepthMeters < 0)
    simpleError("upstreamDepthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.upstreamFroudeNumber) || x.upstreamFroudeNumber < 0)
    simpleError("upstreamFroudeNumber", "Provide a finite number at least 0.");
  if (x.upstreamFroudeNumber <= 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const downstreamDepthMeters =
    0.5 *
    x.upstreamDepthMeters *
    (Math.sqrt(1 + 8 * x.upstreamFroudeNumber ** 2) - 1);
  if (!Number.isFinite(downstreamDepthMeters))
    simpleError(
      "downstreamDepthMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    downstreamDepthMeters: Object.is(downstreamDepthMeters, -0)
      ? 0
      : downstreamDepthMeters,
  };
};

export const example = {
  input: { upstreamDepthMeters: 1, upstreamFroudeNumber: 2 },
  output: { downstreamDepthMeters: 2.3722813232690143 },
} satisfies ToolExample<
  HydraulicJumpSequentDepthInput,
  HydraulicJumpSequentDepthOutput
>;

export const tool = createSimpleTool({
  id: "engineering/hydraulic-jump-sequent-depth",
  title: "Hydraulic Jump Sequent Depth",
  description:
    "Downstream conjugate depth of a hydraulic jump in a horizontal rectangular channel from upstream depth and Froude number.",
  inputs: [
    {
      id: "upstreamDepthMeters",
      kind: "number",
      label: "Upstream Depth Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "upstreamFroudeNumber",
      kind: "number",
      label: "Upstream Froude Number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "downstreamDepthMeters",
      kind: "number",
      label: "Downstream Depth Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateHydraulicJumpSequentDepth({
      upstreamDepthMeters: input.upstreamDepthMeters as number,
      upstreamFroudeNumber: input.upstreamFroudeNumber as number,
    }),
});
export const hydraulicJumpSequentDepthTool = tool;
export const runHydraulicJumpSequentDepth = tool.execute;
export default tool;
