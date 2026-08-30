import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FractureToughnessStressIntensityInput = Readonly<{
  readonly geometryFactor: number;
  readonly remoteStressMegapascals: number;
  readonly crackLengthMeters: number;
}>;
export type FractureToughnessStressIntensityOutput = Readonly<{
  readonly stressIntensityMegaPascalRootMeter: number;
}>;

export const calculateFractureToughnessStressIntensity = (
  x: FractureToughnessStressIntensityInput,
): FractureToughnessStressIntensityOutput => {
  if (!Number.isFinite(x.geometryFactor) || x.geometryFactor < 0)
    simpleError("geometryFactor", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.remoteStressMegapascals) ||
    x.remoteStressMegapascals < 0
  )
    simpleError(
      "remoteStressMegapascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.crackLengthMeters) || x.crackLengthMeters < 0)
    simpleError("crackLengthMeters", "Provide a finite number at least 0.");
  const stressIntensityMegaPascalRootMeter =
    x.geometryFactor *
    x.remoteStressMegapascals *
    Math.sqrt(Math.PI * x.crackLengthMeters);
  if (!Number.isFinite(stressIntensityMegaPascalRootMeter))
    simpleError(
      "stressIntensityMegaPascalRootMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stressIntensityMegaPascalRootMeter: Object.is(
      stressIntensityMegaPascalRootMeter,
      -0,
    )
      ? 0
      : stressIntensityMegaPascalRootMeter,
  };
};

export const example = {
  input: {
    geometryFactor: 1.12,
    remoteStressMegapascals: 100,
    crackLengthMeters: 0.01,
  },
  output: { stressIntensityMegaPascalRootMeter: 19.85148313014178 },
} satisfies ToolExample<
  FractureToughnessStressIntensityInput,
  FractureToughnessStressIntensityOutput
>;

export const tool = createSimpleTool({
  id: "engineering/fracture-toughness-stress-intensity",
  title: "Fracture Toughness Stress Intensity",
  description:
    "Mode-I stress-intensity factor KI=Yσ√(πa) for a supplied geometry factor; not a fracture or safety assessment.",
  inputs: [
    {
      id: "geometryFactor",
      kind: "number",
      label: "Geometry Factor",
      minimum: 0,
    },
    {
      id: "remoteStressMegapascals",
      kind: "number",
      label: "Remote Stress Megapascals",
      unit: "MPa",
      minimum: 0,
    },
    {
      id: "crackLengthMeters",
      kind: "number",
      label: "Crack Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stressIntensityMegaPascalRootMeter",
      kind: "number",
      label: "Stress Intensity Mega Pascal Root Meter",
      unit: "MPa√m",
    },
  ],
  calculate: (input) =>
    calculateFractureToughnessStressIntensity({
      geometryFactor: input.geometryFactor as number,
      remoteStressMegapascals: input.remoteStressMegapascals as number,
      crackLengthMeters: input.crackLengthMeters as number,
    }),
});
export const fractureToughnessStressIntensityTool = tool;
export const runFractureToughnessStressIntensity = tool.execute;
export default tool;
