import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ViscosityQuantity = "dynamic" | "kinematic";
export type ViscosityUnit =
  "Pa*s" | "P" | "cP" | "cSt" | "ft2/s" | "m2/s" | "mPa*s" | "mm2/s" | "St";

export type ConvertViscosityInput = {
  readonly fromUnit: ViscosityUnit;
  readonly quantity: ViscosityQuantity;
  readonly toUnit: ViscosityUnit;
  readonly value: number;
};

export type ConvertViscosityOutput = {
  readonly quantity: ViscosityQuantity;
  readonly unit: ViscosityUnit;
  readonly value: number;
};

const factors: Readonly<
  Record<ViscosityQuantity, Partial<Record<ViscosityUnit, number>>>
> = {
  dynamic: {
    "Pa*s": 1,
    P: 0.1,
    cP: 0.001,
    "mPa*s": 0.001,
  },
  kinematic: {
    "m2/s": 1,
    "mm2/s": 1e-6,
    cSt: 1e-6,
    St: 1e-4,
    "ft2/s": 0.09290304,
  },
};

export const convertViscosity = (
  input: ConvertViscosityInput,
): ConvertViscosityOutput => {
  const fromFactor =
    factors[input.quantity][input.fromUnit] ??
    simpleError(
      "fromUnit",
      "The source unit must belong to the selected viscosity quantity.",
      "viscosity_quantity_mismatch",
    );
  const toFactor =
    factors[input.quantity][input.toUnit] ??
    simpleError(
      "toUnit",
      "The target unit must belong to the selected viscosity quantity.",
      "viscosity_quantity_mismatch",
    );
  const value = (input.value * fromFactor) / toFactor;
  if (!Number.isFinite(value))
    simpleError(
      "value",
      "The converted value is outside the supported numeric range.",
      "result_not_finite",
    );
  return { quantity: input.quantity, unit: input.toUnit, value };
};

export const viscosityExample = {
  input: {
    fromUnit: "Pa*s" as const,
    quantity: "dynamic" as const,
    toUnit: "cP" as const,
    value: 1,
  },
  output: { quantity: "dynamic" as const, unit: "cP" as const, value: 1_000 },
} satisfies ToolExample<ConvertViscosityInput, ConvertViscosityOutput>;

const units = [
  "Pa*s",
  "mPa*s",
  "cP",
  "P",
  "m2/s",
  "mm2/s",
  "cSt",
  "St",
  "ft2/s",
] as const;

export const viscosityTool = createSimpleTool({
  calculate: (input) =>
    convertViscosity({
      fromUnit: input.fromUnit as ViscosityUnit,
      quantity: input.quantity as ViscosityQuantity,
      toUnit: input.toUnit as ViscosityUnit,
      value: input.value as number,
    }),
  description:
    "Convert within dynamic-viscosity or kinematic-viscosity units while preventing dimensionally invalid conversion between the two quantities.",
  id: "convert/viscosity",
  inputs: [
    { id: "value", kind: "number", label: "Value" },
    {
      enum: ["dynamic", "kinematic"],
      id: "quantity",
      kind: "string",
      label: "Viscosity quantity",
    },
    { enum: units, id: "fromUnit", kind: "string", label: "From unit" },
    { enum: units, id: "toUnit", kind: "string", label: "To unit" },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted value" },
    { enum: units, id: "unit", kind: "string", label: "Unit" },
    {
      enum: ["dynamic", "kinematic"],
      id: "quantity",
      kind: "string",
      label: "Viscosity quantity",
    },
  ],
  title: "Convert Dynamic or Kinematic Viscosity",
});

export const runViscosity = viscosityTool.execute;
export default viscosityTool;
