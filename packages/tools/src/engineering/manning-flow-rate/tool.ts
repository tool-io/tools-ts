import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ManningFlowRateInput = Readonly<{
  readonly manningN: number;
  readonly areaSquareMeters: number;
  readonly hydraulicRadiusMeters: number;
  readonly slope: number;
}>;
export type ManningFlowRateOutput = Readonly<{
  readonly flowCubicMetersPerSecond: number;
}>;

export const calculateManningFlowRate = (
  x: ManningFlowRateInput,
): ManningFlowRateOutput => {
  if (!Number.isFinite(x.manningN) || x.manningN < 0)
    simpleError("manningN", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.hydraulicRadiusMeters) || x.hydraulicRadiusMeters < 0)
    simpleError("hydraulicRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.slope) || x.slope < 0)
    simpleError("slope", "Provide a finite number at least 0.");
  const flowCubicMetersPerSecond =
    (x.areaSquareMeters *
      x.hydraulicRadiusMeters ** (2 / 3) *
      Math.sqrt(x.slope)) /
    x.manningN;
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
  input: {
    manningN: 0.03,
    areaSquareMeters: 2,
    hydraulicRadiusMeters: 1,
    slope: 0.001,
  },
  output: { flowCubicMetersPerSecond: 2.1081851067789197 },
} satisfies ToolExample<ManningFlowRateInput, ManningFlowRateOutput>;

export const tool = createSimpleTool({
  id: "engineering/manning-flow-rate",
  title: "Manning Flow Rate",
  description:
    "Open-channel discharge from Manning n, flow area, hydraulic radius and energy slope in SI units.",
  inputs: [
    { id: "manningN", kind: "number", label: "Manning N", minimum: 0 },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "hydraulicRadiusMeters",
      kind: "number",
      label: "Hydraulic Radius Meters",
      unit: "m",
      minimum: 0,
    },
    { id: "slope", kind: "number", label: "Slope", minimum: 0 },
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
    calculateManningFlowRate({
      manningN: input.manningN as number,
      areaSquareMeters: input.areaSquareMeters as number,
      hydraulicRadiusMeters: input.hydraulicRadiusMeters as number,
      slope: input.slope as number,
    }),
});
export const manningFlowRateTool = tool;
export const runManningFlowRate = tool.execute;
export default tool;
