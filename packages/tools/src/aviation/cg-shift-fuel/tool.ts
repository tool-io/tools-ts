import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CgShiftFuelInput = {
  readonly fuelArmCm: number;
  readonly fuelWeightKg: number;
  readonly zeroFuelCgArmCm: number;
  readonly zeroFuelWeightKg: number;
};

export type CgShiftFuelOutput = {
  readonly cgShiftCm: number;
};

export const cgShiftFuelExample = {
  input: {
    fuelArmCm: 240,
    fuelWeightKg: 500,
    zeroFuelCgArmCm: 250,
    zeroFuelWeightKg: 50000,
  },
  output: { cgShiftCm: 0.09900990099009901 },
} satisfies ToolExample<CgShiftFuelInput, CgShiftFuelOutput>;

export const cgShiftFuelTool = createSimpleTool({
  id: "aviation/cg-shift-fuel",
  title: "CG Shift Fuel Calculator",
  description:
    "Calculate the center-of-gravity shift after all specified fuel is burned from its stated arm.",
  inputs: [
    { id: "fuelArmCm", label: "Fuel arm", kind: "number", unit: "cm" },
    { id: "fuelWeightKg", label: "Fuel weight", kind: "number", unit: "kg" },
    {
      id: "zeroFuelCgArmCm",
      label: "Zero-fuel CG arm",
      kind: "number",
      unit: "cm",
    },
    {
      id: "zeroFuelWeightKg",
      label: "Zero fuel weight",
      kind: "number",
      unit: "kg",
    },
  ],
  outputs: [{ id: "cgShiftCm", label: "CG shift", kind: "number", unit: "cm" }],
  calculate: (input) => {
    const fuelWeightKg = input.fuelWeightKg as number;
    const zeroFuelWeightKg = input.zeroFuelWeightKg as number;
    if (fuelWeightKg <= 0)
      simpleError("fuelWeightKg", "The fuel weight must be greater than zero.");
    if (zeroFuelWeightKg <= 0)
      simpleError(
        "zeroFuelWeightKg",
        "The zero fuel weight must be greater than zero.",
      );
    return {
      cgShiftCm:
        (fuelWeightKg *
          ((input.zeroFuelCgArmCm as number) - (input.fuelArmCm as number))) /
        (zeroFuelWeightKg + fuelWeightKg),
    };
  },
});
export const runCgShiftFuel = cgShiftFuelTool.execute;
export default cgShiftFuelTool;
