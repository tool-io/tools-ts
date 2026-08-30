import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TorsionalShearStressInput = Readonly<{
  readonly torqueNewtonMeters: number;
  readonly radiusMeters: number;
  readonly polarMomentMeters4: number;
}>;
export type TorsionalShearStressOutput = Readonly<{
  readonly shearPascals: number;
}>;

export const calculateTorsionalShearStress = (
  x: TorsionalShearStressInput,
): TorsionalShearStressOutput => {
  if (!Number.isFinite(x.torqueNewtonMeters) || x.torqueNewtonMeters < 0)
    simpleError("torqueNewtonMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters < 0)
    simpleError("radiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.polarMomentMeters4) || x.polarMomentMeters4 < 0)
    simpleError("polarMomentMeters4", "Provide a finite number at least 0.");
  const shearPascals =
    (x.torqueNewtonMeters * x.radiusMeters) / x.polarMomentMeters4;
  if (!Number.isFinite(shearPascals))
    simpleError(
      "shearPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { shearPascals: Object.is(shearPascals, -0) ? 0 : shearPascals };
};

export const example = {
  input: {
    torqueNewtonMeters: 100,
    radiusMeters: 0.01,
    polarMomentMeters4: 1e-8,
  },
  output: { shearPascals: 100000000 },
} satisfies ToolExample<TorsionalShearStressInput, TorsionalShearStressOutput>;

export const tool = createSimpleTool({
  id: "engineering/torsional-shear-stress",
  title: "Torsional Shear Stress",
  description:
    "Elastic torsional shear stress at a specified radius from torque and polar second moment; circular shaft assumptions apply.",
  inputs: [
    {
      id: "torqueNewtonMeters",
      kind: "number",
      label: "Torque Newton Meters",
      unit: "N·m",
      minimum: 0,
    },
    {
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "polarMomentMeters4",
      kind: "number",
      label: "Polar Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "shearPascals", kind: "number", label: "Shear Pascals", unit: "Pa" },
  ],
  calculate: (input) =>
    calculateTorsionalShearStress({
      torqueNewtonMeters: input.torqueNewtonMeters as number,
      radiusMeters: input.radiusMeters as number,
      polarMomentMeters4: input.polarMomentMeters4 as number,
    }),
});
export const torsionalShearStressTool = tool;
export const runTorsionalShearStress = tool.execute;
export default tool;
