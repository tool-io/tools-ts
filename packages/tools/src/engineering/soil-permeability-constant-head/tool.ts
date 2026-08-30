import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoilPermeabilityConstantHeadInput = Readonly<{
  readonly collectedCubicMeters: number;
  readonly sampleLengthMeters: number;
  readonly areaSquareMeters: number;
  readonly headDifferenceMeters: number;
  readonly elapsedSeconds: number;
}>;
export type SoilPermeabilityConstantHeadOutput = Readonly<{
  readonly conductivityMetersPerSecond: number;
}>;

export const calculateSoilPermeabilityConstantHead = (
  x: SoilPermeabilityConstantHeadInput,
): SoilPermeabilityConstantHeadOutput => {
  if (!Number.isFinite(x.collectedCubicMeters) || x.collectedCubicMeters < 0)
    simpleError("collectedCubicMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sampleLengthMeters) || x.sampleLengthMeters < 0)
    simpleError("sampleLengthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.headDifferenceMeters) || x.headDifferenceMeters < 0)
    simpleError("headDifferenceMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.elapsedSeconds) || x.elapsedSeconds < 0)
    simpleError("elapsedSeconds", "Provide a finite number at least 0.");
  const conductivityMetersPerSecond =
    (x.collectedCubicMeters * x.sampleLengthMeters) /
    (x.areaSquareMeters * x.headDifferenceMeters * x.elapsedSeconds);
  if (!Number.isFinite(conductivityMetersPerSecond))
    simpleError(
      "conductivityMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    conductivityMetersPerSecond: Object.is(conductivityMetersPerSecond, -0)
      ? 0
      : conductivityMetersPerSecond,
  };
};

export const example = {
  input: {
    collectedCubicMeters: 0.001,
    sampleLengthMeters: 0.1,
    areaSquareMeters: 0.01,
    headDifferenceMeters: 0.5,
    elapsedSeconds: 100,
  },
  output: { conductivityMetersPerSecond: 0.0002 },
} satisfies ToolExample<
  SoilPermeabilityConstantHeadInput,
  SoilPermeabilityConstantHeadOutput
>;

export const tool = createSimpleTool({
  id: "engineering/soil-permeability-constant-head",
  title: "Soil Permeability Constant Head",
  description:
    "Saturated hydraulic conductivity from a constant-head permeameter: k=QL/(Aht), where Q is collected volume.",
  inputs: [
    {
      id: "collectedCubicMeters",
      kind: "number",
      label: "Collected Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "sampleLengthMeters",
      kind: "number",
      label: "Sample Length Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "headDifferenceMeters",
      kind: "number",
      label: "Head Difference Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "elapsedSeconds",
      kind: "number",
      label: "Elapsed Seconds",
      unit: "s",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "conductivityMetersPerSecond",
      kind: "number",
      label: "Conductivity Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateSoilPermeabilityConstantHead({
      collectedCubicMeters: input.collectedCubicMeters as number,
      sampleLengthMeters: input.sampleLengthMeters as number,
      areaSquareMeters: input.areaSquareMeters as number,
      headDifferenceMeters: input.headDifferenceMeters as number,
      elapsedSeconds: input.elapsedSeconds as number,
    }),
});
export const soilPermeabilityConstantHeadTool = tool;
export const runSoilPermeabilityConstantHead = tool.execute;
export default tool;
