import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThinWalledHoopStressInput = Readonly<{
  readonly internalPressurePascals: number;
  readonly meanRadiusMeters: number;
  readonly wallThicknessMeters: number;
}>;
export type ThinWalledHoopStressOutput = Readonly<{
  readonly hoopStressPascals: number;
}>;

export const calculateThinWalledHoopStress = (
  x: ThinWalledHoopStressInput,
): ThinWalledHoopStressOutput => {
  if (
    !Number.isFinite(x.internalPressurePascals) ||
    x.internalPressurePascals < 0
  )
    simpleError(
      "internalPressurePascals",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.meanRadiusMeters) || x.meanRadiusMeters < 0)
    simpleError("meanRadiusMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wallThicknessMeters) || x.wallThicknessMeters < 0)
    simpleError("wallThicknessMeters", "Provide a finite number at least 0.");
  if (x.wallThicknessMeters > x.meanRadiusMeters / 10)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const hoopStressPascals =
    (x.internalPressurePascals * x.meanRadiusMeters) / x.wallThicknessMeters;
  if (!Number.isFinite(hoopStressPascals))
    simpleError(
      "hoopStressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    hoopStressPascals: Object.is(hoopStressPascals, -0) ? 0 : hoopStressPascals,
  };
};

export const example = {
  input: {
    internalPressurePascals: 1000000,
    meanRadiusMeters: 0.1,
    wallThicknessMeters: 0.005,
  },
  output: { hoopStressPascals: 20000000 },
} satisfies ToolExample<ThinWalledHoopStressInput, ThinWalledHoopStressOutput>;

export const tool = createSimpleTool({
  id: "engineering/thin-walled-hoop-stress",
  title: "Thin Walled Hoop Stress",
  description:
    "Thin-walled cylindrical pressure-vessel hoop stress pr/t; requires wall thickness small relative to radius.",
  inputs: [
    {
      id: "internalPressurePascals",
      kind: "number",
      label: "Internal Pressure Pascals",
      unit: "Pa",
      minimum: 0,
    },
    {
      id: "meanRadiusMeters",
      kind: "number",
      label: "Mean Radius Meters",
      unit: "m",
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
      id: "hoopStressPascals",
      kind: "number",
      label: "Hoop Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculateThinWalledHoopStress({
      internalPressurePascals: input.internalPressurePascals as number,
      meanRadiusMeters: input.meanRadiusMeters as number,
      wallThicknessMeters: input.wallThicknessMeters as number,
    }),
});
export const thinWalledHoopStressTool = tool;
export const runThinWalledHoopStress = tool.execute;
export default tool;
