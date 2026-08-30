import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzDarrdichteInput = Readonly<{
  readonly ovenDryMassKilograms: number;
  readonly ovenDryVolumeCubicMeters: number;
}>;
export type HolzDarrdichteOutput = Readonly<{
  readonly densityKgPerM3: number;
}>;

export const calculateHolzDarrdichte = (
  x: HolzDarrdichteInput,
): HolzDarrdichteOutput => {
  if (!Number.isFinite(x.ovenDryMassKilograms) || x.ovenDryMassKilograms < 0)
    simpleError("ovenDryMassKilograms", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.ovenDryVolumeCubicMeters) ||
    x.ovenDryVolumeCubicMeters < 0
  )
    simpleError(
      "ovenDryVolumeCubicMeters",
      "Provide a finite number at least 0.",
    );
  const densityKgPerM3 = x.ovenDryMassKilograms / x.ovenDryVolumeCubicMeters;
  if (!Number.isFinite(densityKgPerM3))
    simpleError(
      "densityKgPerM3",
      "Inputs produce an undefined or non-finite result.",
    );
  return { densityKgPerM3: Object.is(densityKgPerM3, -0) ? 0 : densityKgPerM3 };
};

export const example = {
  input: { ovenDryMassKilograms: 50, ovenDryVolumeCubicMeters: 0.1 },
  output: { densityKgPerM3: 500 },
} satisfies ToolExample<HolzDarrdichteInput, HolzDarrdichteOutput>;

export const tool = createSimpleTool({
  id: "carpentry/holz-darrdichte",
  title: "Holz Darrdichte",
  description:
    "Oven-dry wood density from oven-dry mass and oven-dry volume; both measurements must be made after drying.",
  inputs: [
    {
      id: "ovenDryMassKilograms",
      kind: "number",
      label: "Oven Dry Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "ovenDryVolumeCubicMeters",
      kind: "number",
      label: "Oven Dry Volume Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "densityKgPerM3",
      kind: "number",
      label: "Density Kg Per M3",
      unit: "kg/m³",
    },
  ],
  calculate: (input) =>
    calculateHolzDarrdichte({
      ovenDryMassKilograms: input.ovenDryMassKilograms as number,
      ovenDryVolumeCubicMeters: input.ovenDryVolumeCubicMeters as number,
    }),
});
export const holzDarrdichteTool = tool;
export const runHolzDarrdichte = tool.execute;
export default tool;
