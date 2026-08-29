import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const MU0 = 1.25663706212e-6; // H/m, CODATA 2018 rounded value.
const units = ["A/m", "kA/m", "Oe", "T", "mT", "G"] as const;
const fieldFactors: Readonly<Record<string, number>> = {
  "A/m": 1,
  "kA/m": 1000,
  Oe: 1000 / (4 * Math.PI),
};
const fluxFactors: Readonly<Record<string, number>> = {
  T: 1,
  mT: 0.001,
  G: 0.0001,
};

export const example = {
  input: { fromUnit: "A/m", relativePermeability: 1, toUnit: "T", value: 1 },
  output: { unit: "T", value: MU0 },
} satisfies ToolExample<
  {
    readonly fromUnit: string;
    readonly relativePermeability: number;
    readonly toUnit: string;
    readonly value: number;
  },
  { readonly unit: string; readonly value: number }
>;

export const tool = createSimpleTool({
  id: "convert/magnetic-field",
  title: "Magnetic Field Strength and Flux Density Converter",
  description:
    "Convert H (A/m or oersted) to B (tesla or gauss) using B = μ₀μᵣH. A material's relative permeability is required when crossing dimensions; unit-only conversions do not use it.",
  inputs: [
    { id: "value", kind: "number", label: "Value" },
    { id: "fromUnit", kind: "string", label: "From unit", enum: units },
    { id: "toUnit", kind: "string", label: "To unit", enum: units },
    {
      id: "relativePermeability",
      kind: "number",
      label: "Relative permeability",
      default: 1,
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted value" },
    { id: "unit", kind: "string", label: "Unit", enum: units },
  ],
  calculate: (input) => {
    const from = input.fromUnit as string;
    const to = input.toUnit as string;
    const hFrom = fieldFactors[from];
    const hTo = fieldFactors[to];
    const bFrom = fluxFactors[from];
    const bTo = fluxFactors[to];
    const mu = input.relativePermeability as number;
    let value = Number.NaN;
    if (hFrom !== undefined && hTo !== undefined)
      value = ((input.value as number) * hFrom) / hTo;
    else if (bFrom !== undefined && bTo !== undefined)
      value = ((input.value as number) * bFrom) / bTo;
    else if (hFrom !== undefined && bTo !== undefined)
      value = ((input.value as number) * hFrom * MU0 * mu) / bTo;
    else if (bFrom !== undefined && hTo !== undefined)
      value = ((input.value as number) * bFrom) / (MU0 * mu * hTo);
    else simpleError("fromUnit", "Select supported magnetic field units.");
    if (!Number.isFinite(value))
      simpleError("value", "Conversion overflows the finite number range.");
    return { unit: to, value };
  },
});
export type MagneticFieldInput = Readonly<typeof example.input>;
export type MagneticFieldOutput = Readonly<typeof example.output>;
export const magneticFieldTool = tool;
export const runMagneticField = tool.execute;
export default tool;
