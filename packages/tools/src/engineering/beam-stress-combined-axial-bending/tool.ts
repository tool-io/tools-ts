import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BeamStressCombinedAxialBendingInput = Readonly<{
  readonly axialForceNewtons: number;
  readonly areaSquareMeters: number;
  readonly bendingMomentNewtonMeters: number;
  readonly fiberDistanceMeters: number;
  readonly secondMomentMeters4: number;
}>;
export type BeamStressCombinedAxialBendingOutput = Readonly<{
  readonly stressPascals: number;
}>;

export const calculateBeamStressCombinedAxialBending = (
  x: BeamStressCombinedAxialBendingInput,
): BeamStressCombinedAxialBendingOutput => {
  if (!Number.isFinite(x.axialForceNewtons))
    simpleError("axialForceNewtons", "Provide a finite number.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.bendingMomentNewtonMeters))
    simpleError("bendingMomentNewtonMeters", "Provide a finite number.");
  if (!Number.isFinite(x.fiberDistanceMeters))
    simpleError("fiberDistanceMeters", "Provide a finite number.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  const stressPascals =
    x.axialForceNewtons / x.areaSquareMeters +
    (x.bendingMomentNewtonMeters * x.fiberDistanceMeters) /
      x.secondMomentMeters4;
  if (!Number.isFinite(stressPascals))
    simpleError(
      "stressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stressPascals: Object.is(stressPascals, -0) ? 0 : stressPascals };
};

export const example = {
  input: {
    axialForceNewtons: 10000,
    areaSquareMeters: 0.01,
    bendingMomentNewtonMeters: 1000,
    fiberDistanceMeters: 0.05,
    secondMomentMeters4: 0.00001,
  },
  output: { stressPascals: 6000000 },
} satisfies ToolExample<
  BeamStressCombinedAxialBendingInput,
  BeamStressCombinedAxialBendingOutput
>;

export const tool = createSimpleTool({
  id: "engineering/beam-stress-combined-axial-bending",
  title: "Beam Stress Combined Axial Bending",
  description:
    "Combined elastic normal stress N/A+My/I at a chosen signed fiber coordinate; excludes buckling and local effects.",
  inputs: [
    {
      id: "axialForceNewtons",
      kind: "number",
      label: "Axial Force Newtons",
      unit: "N",
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "bendingMomentNewtonMeters",
      kind: "number",
      label: "Bending Moment Newton Meters",
      unit: "N·m",
    },
    {
      id: "fiberDistanceMeters",
      kind: "number",
      label: "Fiber Distance Meters",
      unit: "m",
    },
    {
      id: "secondMomentMeters4",
      kind: "number",
      label: "Second Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stressPascals",
      kind: "number",
      label: "Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateBeamStressCombinedAxialBending({
      axialForceNewtons: input.axialForceNewtons as number,
      areaSquareMeters: input.areaSquareMeters as number,
      bendingMomentNewtonMeters: input.bendingMomentNewtonMeters as number,
      fiberDistanceMeters: input.fiberDistanceMeters as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
    }),
});
export const beamStressCombinedAxialBendingTool = tool;
export const runBeamStressCombinedAxialBending = tool.execute;
export default tool;
