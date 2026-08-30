import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StressForceInput = Readonly<{
  readonly forceNewtons: number;
  readonly areaSquareMeters: number;
}>;
export type StressForceOutput = Readonly<{
  readonly stressPascals: number;
}>;

export const calculateStressForce = (
  x: StressForceInput,
): StressForceOutput => {
  if (!Number.isFinite(x.forceNewtons))
    simpleError("forceNewtons", "Provide a finite number.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  const stressPascals = x.forceNewtons / x.areaSquareMeters;
  if (!Number.isFinite(stressPascals))
    simpleError(
      "stressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { stressPascals: Object.is(stressPascals, -0) ? 0 : stressPascals };
};

export const example = {
  input: { forceNewtons: 1000, areaSquareMeters: 0.01 },
  output: { stressPascals: 100000 },
} satisfies ToolExample<StressForceInput, StressForceOutput>;

export const tool = createSimpleTool({
  id: "engineering/stress-force",
  title: "Stress Force",
  description:
    "Average normal stress from an axial force divided by loaded cross-sectional area; excludes bending and stress concentrations.",
  inputs: [
    { id: "forceNewtons", kind: "number", label: "Force Newtons", unit: "N" },
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
      id: "stressPascals",
      kind: "number",
      label: "Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateStressForce({
      forceNewtons: input.forceNewtons as number,
      areaSquareMeters: input.areaSquareMeters as number,
    }),
});
export const stressForceTool = tool;
export const runStressForce = tool.execute;
export default tool;
