import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InjectionMoldingClampingForceInput = Readonly<{
  readonly projectedSquareCentimeters: number;
  readonly cavityPressureMegapascals: number;
}>;
export type InjectionMoldingClampingForceOutput = Readonly<{
  readonly clampingKilonewtons: number;
}>;

export const calculateInjectionMoldingClampingForce = (
  x: InjectionMoldingClampingForceInput,
): InjectionMoldingClampingForceOutput => {
  if (
    !Number.isFinite(x.projectedSquareCentimeters) ||
    x.projectedSquareCentimeters < 0
  )
    simpleError(
      "projectedSquareCentimeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.cavityPressureMegapascals) ||
    x.cavityPressureMegapascals < 0
  )
    simpleError(
      "cavityPressureMegapascals",
      "Provide a finite number at least 0.",
    );
  const clampingKilonewtons =
    (x.projectedSquareCentimeters * x.cavityPressureMegapascals) / 10;
  if (!Number.isFinite(clampingKilonewtons))
    simpleError(
      "clampingKilonewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    clampingKilonewtons: Object.is(clampingKilonewtons, -0)
      ? 0
      : clampingKilonewtons,
  };
};

export const example = {
  input: { projectedSquareCentimeters: 100, cavityPressureMegapascals: 40 },
  output: { clampingKilonewtons: 400 },
} satisfies ToolExample<
  InjectionMoldingClampingForceInput,
  InjectionMoldingClampingForceOutput
>;

export const tool = createSimpleTool({
  id: "engineering/injection-molding-clamping-force",
  title: "Injection Molding Clamping Force",
  description:
    "Ideal cavity-opening force from projected area times cavity pressure; mold safety margins are not included.",
  inputs: [
    {
      id: "projectedSquareCentimeters",
      kind: "number",
      label: "Projected Square Centimeters",
      unit: "cm²",
      minimum: 0,
    },
    {
      id: "cavityPressureMegapascals",
      kind: "number",
      label: "Cavity Pressure Megapascals",
      unit: "MPa",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "clampingKilonewtons",
      kind: "number",
      label: "Clamping Kilonewtons",
      unit: "kN",
    },
  ],
  calculate: (input) =>
    calculateInjectionMoldingClampingForce({
      projectedSquareCentimeters: input.projectedSquareCentimeters as number,
      cavityPressureMegapascals: input.cavityPressureMegapascals as number,
    }),
});
export const injectionMoldingClampingForceTool = tool;
export const runInjectionMoldingClampingForce = tool.execute;
export default tool;
