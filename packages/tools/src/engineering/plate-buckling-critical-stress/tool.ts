import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PlateBucklingCriticalStressInput = Readonly<{
  readonly bucklingCoefficient: number;
  readonly modulusPascals: number;
  readonly poissonRatio: number;
  readonly thicknessMeters: number;
  readonly widthMeters: number;
}>;
export type PlateBucklingCriticalStressOutput = Readonly<{
  readonly criticalStressPascals: number;
}>;

export const calculatePlateBucklingCriticalStress = (
  x: PlateBucklingCriticalStressInput,
): PlateBucklingCriticalStressOutput => {
  if (!Number.isFinite(x.bucklingCoefficient) || x.bucklingCoefficient < 0)
    simpleError("bucklingCoefficient", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.modulusPascals) || x.modulusPascals < 0)
    simpleError("modulusPascals", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.poissonRatio))
    simpleError("poissonRatio", "Provide a finite number.");
  if (!Number.isFinite(x.thicknessMeters) || x.thicknessMeters < 0)
    simpleError("thicknessMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.widthMeters) || x.widthMeters < 0)
    simpleError("widthMeters", "Provide a finite number at least 0.");
  if (x.poissonRatio <= -1 || x.poissonRatio >= 0.5)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const criticalStressPascals =
    ((x.bucklingCoefficient * Math.PI ** 2 * x.modulusPascals) /
      (12 * (1 - x.poissonRatio ** 2))) *
    (x.thicknessMeters / x.widthMeters) ** 2;
  if (!Number.isFinite(criticalStressPascals))
    simpleError(
      "criticalStressPascals",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    criticalStressPascals: Object.is(criticalStressPascals, -0)
      ? 0
      : criticalStressPascals,
  };
};

export const example = {
  input: {
    bucklingCoefficient: 4,
    modulusPascals: 200000000000,
    poissonRatio: 0.3,
    thicknessMeters: 0.005,
    widthMeters: 0.1,
  },
  output: { criticalStressPascals: 1807619853.6793692 },
} satisfies ToolExample<
  PlateBucklingCriticalStressInput,
  PlateBucklingCriticalStressOutput
>;

export const tool = createSimpleTool({
  id: "engineering/plate-buckling-critical-stress",
  title: "Plate Buckling Critical Stress",
  description:
    "Classical elastic plate local buckling stress kπ²E/[12(1−ν²)](t/b)² for a supplied boundary-condition coefficient.",
  inputs: [
    {
      id: "bucklingCoefficient",
      kind: "number",
      label: "Buckling Coefficient",
      minimum: 0,
    },
    {
      id: "modulusPascals",
      kind: "number",
      label: "Modulus Pascals",
      unit: "Pa",
      minimum: 0,
    },
    { id: "poissonRatio", kind: "number", label: "Poisson Ratio" },
    {
      id: "thicknessMeters",
      kind: "number",
      label: "Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "widthMeters",
      kind: "number",
      label: "Width Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "criticalStressPascals",
      kind: "number",
      label: "Critical Stress Pascals",
      unit: "Pa",
    },
  ],
  calculate: (input) =>
    calculatePlateBucklingCriticalStress({
      bucklingCoefficient: input.bucklingCoefficient as number,
      modulusPascals: input.modulusPascals as number,
      poissonRatio: input.poissonRatio as number,
      thicknessMeters: input.thicknessMeters as number,
      widthMeters: input.widthMeters as number,
    }),
});
export const plateBucklingCriticalStressTool = tool;
export const runPlateBucklingCriticalStress = tool.execute;
export default tool;
