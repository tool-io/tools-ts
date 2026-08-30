import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FlowRateVelocityAreaInput = Readonly<{
  readonly speedMetersPerSecond: number;
  readonly areaSquareMeters: number;
}>;
export type FlowRateVelocityAreaOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateFlowRateVelocityArea = (
  x: FlowRateVelocityAreaInput,
): FlowRateVelocityAreaOutput => {
  if (!Number.isFinite(x.speedMetersPerSecond) || x.speedMetersPerSecond < 0)
    simpleError("speedMetersPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  const flowCubicMetersPerSecond = x.speedMetersPerSecond * x.areaSquareMeters;
  if (!Number.isFinite(flowCubicMetersPerSecond))
    simpleError(
      "flowCubicMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    flowCubicMetersPerSecond: Object.is(flowCubicMetersPerSecond, -0)
      ? 0
      : flowCubicMetersPerSecond,
  };
};

export const example = {
  input: { speedMetersPerSecond: 2, areaSquareMeters: 0.05 },
  output: { flowCubicMetersPerSecond: 0.1 },
} satisfies ToolExample<FlowRateVelocityAreaInput, FlowRateVelocityAreaOutput>;

export const tool = createSimpleTool({
  id: "engineering/flow-rate-velocity-area",
  title: "Flow Rate Velocity Area",
  description:
    "Volumetric flow rate from mean cross-sectional velocity and flow area.",
  inputs: [
    {
      id: "speedMetersPerSecond",
      kind: "number",
      label: "Speed Meters Per Second",
      unit: "m/s",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "flowCubicMetersPerSecond",
      kind: "number",
      label: "Flow Cubic Meters Per Second",
      unit: "m³/s",
    },
  ],
  calculate: (input) =>
    calculateFlowRateVelocityArea({
      speedMetersPerSecond: input.speedMetersPerSecond as number,
      areaSquareMeters: input.areaSquareMeters as number,
    }),
});
export const flowRateVelocityAreaTool = tool;
export const runFlowRateVelocityArea = tool.execute;
export default tool;
