import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MomentInertiaCircleInput = Readonly<{
  readonly diameterMeters: number;
}>;
export type MomentInertiaCircleOutput = Readonly<{
  readonly secondMomentMeters4: number;
}>;

export const calculateMomentInertiaCircle = (
  x: MomentInertiaCircleInput,
): MomentInertiaCircleOutput => {
  if (!Number.isFinite(x.diameterMeters) || x.diameterMeters < 0)
    simpleError("diameterMeters", "Provide a finite number at least 0.");
  const secondMomentMeters4 = (Math.PI * x.diameterMeters ** 4) / 64;
  if (!Number.isFinite(secondMomentMeters4))
    simpleError(
      "secondMomentMeters4",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    secondMomentMeters4: Object.is(secondMomentMeters4, -0)
      ? 0
      : secondMomentMeters4,
  };
};

export const example = {
  input: { diameterMeters: 0.1 },
  output: { secondMomentMeters4: 0.0000049087385212340526 },
} satisfies ToolExample<MomentInertiaCircleInput, MomentInertiaCircleOutput>;

export const tool = createSimpleTool({
  id: "engineering/moment-inertia-circle",
  title: "Moment Inertia Circle",
  description:
    "Centroidal second moment of area of a solid circular section about any in-plane diameter: πd⁴/64.",
  inputs: [
    {
      id: "diameterMeters",
      kind: "number",
      label: "Diameter Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "secondMomentMeters4",
      kind: "number",
      label: "Second Moment Meters4",
      unit: "m⁴",
    },
  ],
  calculate: (input) =>
    calculateMomentInertiaCircle({
      diameterMeters: input.diameterMeters as number,
    }),
});
export const momentInertiaCircleTool = tool;
export const runMomentInertiaCircle = tool.execute;
export default tool;
