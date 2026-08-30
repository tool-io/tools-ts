import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThickWalledHoopStressInput = Readonly<{
  readonly internalPressurePascals: number;
  readonly innerRadiusMeters: number;
  readonly outerRadiusMeters: number;
}>;
export type ThickWalledHoopStressOutput = Readonly<{
  readonly innerHoopStressPascals: number;
}>;

export const calculateThickWalledHoopStress = (
  x: ThickWalledHoopStressInput,
): ThickWalledHoopStressOutput => {
  if (
    !Number.isFinite(x.internalPressurePascals) ||
    x.internalPressurePascals < 0
  )
    simpleError(
      "internalPressurePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.innerRadiusMeters) || x.innerRadiusMeters < 0)
    simpleError("innerRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outerRadiusMeters) || x.outerRadiusMeters < 0)
    simpleError("outerRadiusMeters", "Provide a finite number at least 0.");
  if (x.outerRadiusMeters <= x.innerRadiusMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const innerHoopStressPascals =
    (x.internalPressurePascals *
      (x.outerRadiusMeters ** 2 + x.innerRadiusMeters ** 2)) /
    (x.outerRadiusMeters ** 2 - x.innerRadiusMeters ** 2);
  if (!Number.isFinite(innerHoopStressPascals))
    simpleError(
      "innerHoopStressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    innerHoopStressPascals: Object.is(innerHoopStressPascals, -0)
      ? 0
      : innerHoopStressPascals,
  };
};

export const example = {
  input: {
    internalPressurePascals: 1000000,
    innerRadiusMeters: 0.05,
    outerRadiusMeters: 0.1,
  },
  output: { innerHoopStressPascals: 1666666.6666666665 },
} satisfies ToolExample<
  ThickWalledHoopStressInput,
  ThickWalledHoopStressOutput
>;

export const tool = createSimpleTool({
  id: "engineering/thick-walled-hoop-stress",
  title: "Thick Walled Hoop Stress",
  description:
    "Lamé hoop stress at the inner wall of a thick cylinder under internal pressure only; assumes elastic axisymmetric conditions.",
  inputs: [
    {
      id: "internalPressurePascals",
      kind: "number",
      label: "Internal Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "innerRadiusMeters",
      kind: "number",
      label: "Inner Radius Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "outerRadiusMeters",
      kind: "number",
      label: "Outer Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "innerHoopStressPascals",
      kind: "number",
      label: "Inner Hoop Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateThickWalledHoopStress({
      internalPressurePascals: input.internalPressurePascals as number,
      innerRadiusMeters: input.innerRadiusMeters as number,
      outerRadiusMeters: input.outerRadiusMeters as number,
    }),
});
export const thickWalledHoopStressTool = tool;
export const runThickWalledHoopStress = tool.execute;
export default tool;
