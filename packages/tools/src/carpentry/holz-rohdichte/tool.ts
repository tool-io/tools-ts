import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HolzRohdichteInput = Readonly<{
  readonly massKilograms: number;
  readonly volumeCubicMeters: number;
}>;
export type HolzRohdichteOutput = Readonly<{
  readonly densityKgPerM3: number;
}>;

export const calculateHolzRohdichte = (
  x: HolzRohdichteInput,
): HolzRohdichteOutput => {
  if (!Number.isFinite(x.massKilograms) || x.massKilograms < 0)
    simpleError("massKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.volumeCubicMeters) || x.volumeCubicMeters < 0)
    simpleError("volumeCubicMeters", "Provide a finite number at least 0.");
  const densityKgPerM3 = x.massKilograms / x.volumeCubicMeters;
  if (!Number.isFinite(densityKgPerM3))
    simpleError(
      "densityKgPerM3",
      "Inputs produce an undefined or non-finite result.",
    );
  return { densityKgPerM3: Object.is(densityKgPerM3, -0) ? 0 : densityKgPerM3 };
};

export const example = {
  input: { massKilograms: 50, volumeCubicMeters: 0.1 },
  output: { densityKgPerM3: 500 },
} satisfies ToolExample<HolzRohdichteInput, HolzRohdichteOutput>;

export const tool = createSimpleTool({
  id: "carpentry/holz-rohdichte",
  title: "Holz Rohdichte",
  description:
    "Bulk density of wood at a specified moisture state from mass and volume measured at that same state.",
  inputs: [
    {
      id: "massKilograms",
      kind: "number",
      label: "Mass Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "volumeCubicMeters",
      kind: "number",
      label: "Volume Cubic Meters",
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
    calculateHolzRohdichte({
      massKilograms: input.massKilograms as number,
      volumeCubicMeters: input.volumeCubicMeters as number,
    }),
});
export const holzRohdichteTool = tool;
export const runHolzRohdichte = tool.execute;
export default tool;
