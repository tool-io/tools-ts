import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MomentInertiaRectangleInput = Readonly<{
  readonly widthMeters: number;
  readonly heightMeters: number;
}>;
export type MomentInertiaRectangleOutput = Readonly<{
  readonly secondMomentMeters4: number;
}>;

export const calculateMomentInertiaRectangle = (
  x: MomentInertiaRectangleInput,
): MomentInertiaRectangleOutput => {
  if (!Number.isFinite(x.widthMeters) || x.widthMeters < 0)
    simpleError("widthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.heightMeters) || x.heightMeters < 0)
    simpleError("heightMeters", "Provide a finite number at least 0.");
  const secondMomentMeters4 = (x.widthMeters * x.heightMeters ** 3) / 12;
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
  input: { widthMeters: 0.1, heightMeters: 0.2 },
  output: { secondMomentMeters4: 0.00006666666666666668 },
} satisfies ToolExample<
  MomentInertiaRectangleInput,
  MomentInertiaRectangleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/moment-inertia-rectangle",
  title: "Moment Inertia Rectangle",
  description:
    "Centroidal second moment of area for a solid rectangle about the axis parallel to its width: bh³/12.",
  inputs: [
    {
      id: "widthMeters",
      kind: "number",
      label: "Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "heightMeters",
      kind: "number",
      label: "Height Meters",
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
    calculateMomentInertiaRectangle({
      widthMeters: input.widthMeters as number,
      heightMeters: input.heightMeters as number,
    }),
});
export const momentInertiaRectangleTool = tool;
export const runMomentInertiaRectangle = tool.execute;
export default tool;
