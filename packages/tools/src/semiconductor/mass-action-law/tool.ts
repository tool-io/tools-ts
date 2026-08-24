import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MassActionLawInput = {
  readonly electronConc: number;
  readonly holeConc: number;
  readonly intrinsicConc: number;
};

export type MassActionLawOutput = {
  readonly deviationPercent: number;
  readonly product: number;
};

export const massActionLawExample = {
  input: { electronConc: 1e16, holeConc: 2e4, intrinsicConc: 1e10 },
  output: { product: 200000000000000000000, deviationPercent: 100 },
} satisfies ToolExample<MassActionLawInput, MassActionLawOutput>;

export const massActionLawTool = createSimpleTool({
  id: "semiconductor/mass-action-law",
  title: "Mass Action Law Check",
  description:
    "Check the mass action law by comparing the electron-hole product against the square of the intrinsic carrier concentration.",
  inputs: [
    {
      id: "electronConc",
      label: "Electron concentration",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Electron concentration n.",
    },
    {
      id: "holeConc",
      label: "Hole concentration",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Hole concentration p.",
    },
    {
      id: "intrinsicConc",
      label: "Intrinsic concentration",
      kind: "number",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
      format: "density-per-cm3",
      description: "Intrinsic carrier concentration ni.",
    },
  ],
  outputs: [
    {
      id: "product",
      label: "np product",
      kind: "number",
      unit: "cm^-6",
      description: "Product of the electron and hole concentrations.",
    },
    {
      id: "deviationPercent",
      label: "Deviation percent",
      kind: "number",
      unit: "%",
      description:
        "Relative deviation of the product from the squared intrinsic concentration.",
    },
  ],
  calculate: (input) => {
    const electronConc = input.electronConc as number;
    const holeConc = input.holeConc as number;
    const intrinsicConc = input.intrinsicConc as number;
    if (electronConc <= 0)
      simpleError(
        "electronConc",
        "Electron concentration must be positive.",
        "invalid_concentration",
      );
    if (holeConc <= 0)
      simpleError(
        "holeConc",
        "Hole concentration must be positive.",
        "invalid_concentration",
      );
    if (intrinsicConc <= 0)
      simpleError(
        "intrinsicConc",
        "Intrinsic concentration must be positive.",
        "invalid_concentration",
      );
    const product = electronConc * holeConc;
    if (!Number.isFinite(product) || product <= 0)
      simpleError(
        "electronConc",
        "The carrier-concentration product is outside the representable range.",
        "numeric_range",
      );
    const intrinsicSquared = intrinsicConc * intrinsicConc;
    const directRatio = product / intrinsicSquared;
    const ratio =
      Number.isFinite(directRatio) && directRatio > 0
        ? directRatio
        : Math.exp(
            Math.log(electronConc) +
              Math.log(holeConc) -
              2 * Math.log(intrinsicConc),
          );
    const deviationPercent = Math.abs(ratio - 1) * 100;
    if (!Number.isFinite(deviationPercent))
      simpleError(
        "intrinsicConc",
        "The relative deviation is outside the representable range.",
        "numeric_range",
      );
    return {
      product,
      deviationPercent,
    };
  },
});
export const runMassActionLaw = massActionLawTool.execute;
export default massActionLawTool;
