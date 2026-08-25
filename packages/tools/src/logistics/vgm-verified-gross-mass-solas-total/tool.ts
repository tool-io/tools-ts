import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VgmVerifiedGrossMassSolasTotalInput = {
  readonly cargoMassKg: number;
  readonly packagingAndDunnageKg?: number;
  readonly containerTareMassKg: number;
};

export type VgmVerifiedGrossMassSolasTotalOutput = {
  readonly verifiedGrossMassKg: number;
};

export const calculateVgmVerifiedGrossMassSolasTotal = (
  input: VgmVerifiedGrossMassSolasTotalInput,
): VgmVerifiedGrossMassSolasTotalOutput => {
  if (!Number.isFinite(input.cargoMassKg) || input.cargoMassKg < 0)
    return simpleError(
      "cargoMassKg",
      "Cargo mass must be finite and non-negative.",
      "invalid_mass",
    );
  const packagingAndDunnageKg = input.packagingAndDunnageKg ?? 0;
  if (!Number.isFinite(packagingAndDunnageKg) || packagingAndDunnageKg < 0)
    return simpleError(
      "packagingAndDunnageKg",
      "Packaging and dunnage mass must be finite and non-negative.",
      "invalid_mass",
    );
  if (
    !Number.isFinite(input.containerTareMassKg) ||
    input.containerTareMassKg <= 0
  )
    return simpleError(
      "containerTareMassKg",
      "The container tare mass must be finite and greater than zero.",
      "invalid_mass",
    );
  const verifiedGrossMassKg =
    input.cargoMassKg + packagingAndDunnageKg + input.containerTareMassKg;
  if (!Number.isFinite(verifiedGrossMassKg))
    return simpleError(
      "cargoMassKg",
      "Verified gross mass is outside the representable range.",
      "mass_out_of_range",
    );
  return { verifiedGrossMassKg };
};

export const vgmVerifiedGrossMassSolasTotalExample = {
  input: {
    cargoMassKg: 18500,
    packagingAndDunnageKg: 260,
    containerTareMassKg: 2230,
  },
  output: { verifiedGrossMassKg: 20990 },
} satisfies ToolExample<
  VgmVerifiedGrossMassSolasTotalInput,
  VgmVerifiedGrossMassSolasTotalOutput
>;

export const vgmVerifiedGrossMassSolasTotalTool = createSimpleTool({
  id: "logistics/vgm-verified-gross-mass-solas-total",
  title: "VGM Verified Gross Mass (SOLAS) Total",
  description:
    "Compute the SOLAS verified gross mass by the summation method: cargo mass plus packaging and dunnage plus the container tare weight from its safety plate.",
  inputs: [
    {
      description: "Cargo mass in kilograms.",
      id: "cargoMassKg",
      kind: "number",
      label: "Cargo",
      minimum: 0,
      unit: "kg",
    },
    {
      default: 0,
      description: "Packaging, pallets and dunnage mass in kilograms.",
      id: "packagingAndDunnageKg",
      kind: "number",
      label: "Packing",
      minimum: 0,
      unit: "kg",
    },
    {
      description:
        "Container tare mass in kilograms from the safety approval plate.",
      id: "containerTareMassKg",
      kind: "number",
      label: "Tare",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Verified gross mass of the packed container in kilograms.",
      id: "verifiedGrossMassKg",
      kind: "number",
      label: "VGM",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateVgmVerifiedGrossMassSolasTotal({
      cargoMassKg: input.cargoMassKg as number,
      containerTareMassKg: input.containerTareMassKg as number,
      packagingAndDunnageKg: input.packagingAndDunnageKg as number | undefined,
    }),
});

export const runVgmVerifiedGrossMassSolasTotal =
  vgmVerifiedGrossMassSolasTotalTool.execute;
export default vgmVerifiedGrossMassSolasTotalTool;
