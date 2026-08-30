import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShearStressBeamInput = Readonly<{
  readonly shearNewtons: number;
  readonly firstMomentMeters3: number;
  readonly secondMomentMeters4: number;
  readonly sectionWidthMeters: number;
}>;
export type ShearStressBeamOutput = Readonly<{
  readonly shearStressPascals: number;
}>;

export const calculateShearStressBeam = (
  x: ShearStressBeamInput,
): ShearStressBeamOutput => {
  if (!Number.isFinite(x.shearNewtons) || x.shearNewtons < 0)
    simpleError("shearNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.firstMomentMeters3) || x.firstMomentMeters3 < 0)
    simpleError("firstMomentMeters3", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondMomentMeters4) || x.secondMomentMeters4 < 0)
    simpleError("secondMomentMeters4", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.sectionWidthMeters) || x.sectionWidthMeters < 0)
    simpleError("sectionWidthMeters", "Provide a finite number at least 0.");
  const shearStressPascals =
    (x.shearNewtons * x.firstMomentMeters3) /
    (x.secondMomentMeters4 * x.sectionWidthMeters);
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
    shearNewtons: 1000,
    firstMomentMeters3: 0.0001,
    secondMomentMeters4: 0.00001,
    sectionWidthMeters: 0.1,
  },
  output: { shearStressPascals: 99999.99999999999 },
} satisfies ToolExample<ShearStressBeamInput, ShearStressBeamOutput>;

export const tool = createSimpleTool({
  id: "engineering/shear-stress-beam",
  title: "Shear Stress Beam",
  description:
    "Elastic beam shear stress τ=VQ/(Ib) at a section with supplied first and second area moments and local width.",
  inputs: [
    {
      id: "shearNewtons",
      kind: "number",
      label: "Shear Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "firstMomentMeters3",
      kind: "number",
      label: "First Moment Meters3",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "secondMomentMeters4",
      kind: "number",
      label: "Second Moment Meters4",
      unit: "m⁴",
      minimum: 0,
    },
    {
      id: "sectionWidthMeters",
      kind: "number",
      label: "Section Width Meters",
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
    calculateShearStressBeam({
      shearNewtons: input.shearNewtons as number,
      firstMomentMeters3: input.firstMomentMeters3 as number,
      secondMomentMeters4: input.secondMomentMeters4 as number,
      sectionWidthMeters: input.sectionWidthMeters as number,
    }),
});
export const shearStressBeamTool = tool;
export const runShearStressBeam = tool.execute;
export default tool;
