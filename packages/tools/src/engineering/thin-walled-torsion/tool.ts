import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThinWalledTorsionInput = Readonly<{
  readonly torqueNewtonMeters: number;
  readonly enclosedMedianAreaSquareMeters: number;
  readonly wallThicknessMeters: number;
}>;
export type ThinWalledTorsionOutput = Readonly<{
  readonly shearStressPascals: number;
}>;

export const calculateThinWalledTorsion = (
  x: ThinWalledTorsionInput,
): ThinWalledTorsionOutput => {
  if (!Number.isFinite(x.torqueNewtonMeters))
    simpleError("torqueNewtonMeters", "Provide a finite number.");
  if (
    !Number.isFinite(x.enclosedMedianAreaSquareMeters) ||
    x.enclosedMedianAreaSquareMeters < 0
  )
    simpleError(
      "enclosedMedianAreaSquareMeters",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.wallThicknessMeters) || x.wallThicknessMeters < 0)
    simpleError("wallThicknessMeters", "Provide a finite number at least 0.");
  const shearStressPascals =
    x.torqueNewtonMeters /
    (2 * x.enclosedMedianAreaSquareMeters * x.wallThicknessMeters);
  if (!Number.isFinite(shearStressPascals))
    simpleError(
      "shearStressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shearStressPascals: Object.is(shearStressPascals, -0)
      ? 0
      : shearStressPascals,
  };
};

export const example = {
  input: {
    torqueNewtonMeters: 1000,
    enclosedMedianAreaSquareMeters: 0.01,
    wallThicknessMeters: 0.002,
  },
  output: { shearStressPascals: 24999999.999999996 },
} satisfies ToolExample<ThinWalledTorsionInput, ThinWalledTorsionOutput>;

export const tool = createSimpleTool({
  id: "engineering/thin-walled-torsion",
  title: "Thin Walled Torsion",
  description:
    "Bredt–Batho mean shear stress in a closed thin-walled single-cell section with uniform wall thickness: τ=T/(2Amt).",
  inputs: [
    {
      id: "torqueNewtonMeters",
      kind: "number",
      label: "Torque Newton Meters",
      unit: "N·m",
    },
    {
      id: "enclosedMedianAreaSquareMeters",
      kind: "number",
      label: "Enclosed Median Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "wallThicknessMeters",
      kind: "number",
      label: "Wall Thickness Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shearStressPascals",
      kind: "number",
      label: "Shear Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateThinWalledTorsion({
      torqueNewtonMeters: input.torqueNewtonMeters as number,
      enclosedMedianAreaSquareMeters:
        input.enclosedMedianAreaSquareMeters as number,
      wallThicknessMeters: input.wallThicknessMeters as number,
    }),
});
export const thinWalledTorsionTool = tool;
export const runThinWalledTorsion = tool.execute;
export default tool;
