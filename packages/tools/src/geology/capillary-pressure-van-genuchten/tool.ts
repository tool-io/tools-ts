import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapillaryPressureVanGenuchtenInput = {
  readonly effectiveSaturation: number;
  readonly alphaPerPascal: number;
  readonly poreSizeIndex?: number;
};

export type CapillaryPressureVanGenuchtenOutput = {
  readonly mExponent: number;
  readonly capillaryPressurePa: number;
};

export const calculateCapillaryPressureVanGenuchten = (
  input: CapillaryPressureVanGenuchtenInput,
): CapillaryPressureVanGenuchtenOutput => {
  const poreSizeIndex = input.poreSizeIndex ?? 2;
  if (!(input.alphaPerPascal > 0))
    simpleError("alphaPerPascal", "Alpha must be positive.", "invalid_alpha");
  if (!(poreSizeIndex > 1))
    simpleError(
      "poreSizeIndex",
      "Pore size index n must be greater than one.",
      "invalid_exponent",
    );
  if (!(input.effectiveSaturation > 0 && input.effectiveSaturation <= 1))
    simpleError(
      "effectiveSaturation",
      "Effective saturation must lie between zero and one.",
      "invalid_saturation",
    );
  const mExponent = 1 - 1 / poreSizeIndex;
  return {
    mExponent,
    capillaryPressurePa:
      Math.pow(
        input.effectiveSaturation ** (-1 / mExponent) - 1,
        1 / poreSizeIndex,
      ) / input.alphaPerPascal,
  };
};

export const capillaryPressureVanGenuchtenExample = {
  input: { effectiveSaturation: 0.5, alphaPerPascal: 5e-5, poreSizeIndex: 2 },
  output: { mExponent: 0.5, capillaryPressurePa: 34641.016151377546 },
} satisfies ToolExample<
  CapillaryPressureVanGenuchtenInput,
  CapillaryPressureVanGenuchtenOutput
>;

export const capillaryPressureVanGenuchtenTool = createSimpleTool({
  id: "geology/capillary-pressure-van-genuchten",
  title: "Capillary Pressure Van Genuchten Calculator",
  description:
    "Invert the van Genuchten retention curve Se = [1 + (alpha Pc)^n]^(-m), with m = 1 - 1/n, to obtain capillary pressure in pascals.",
  inputs: [
    {
      description: "Effective saturation Se as a fraction.",
      id: "effectiveSaturation",
      kind: "number",
      label: "Se",
      maximum: 1,
    },
    {
      description: "Van Genuchten alpha in inverse pascals.",
      id: "alphaPerPascal",
      kind: "number",
      label: "Alpha",
    },
    {
      default: 2,
      description: "Pore size index n, greater than one.",
      id: "poreSizeIndex",
      kind: "number",
      label: "n",
    },
  ],
  outputs: [
    {
      description: "Mualem exponent m equal to 1 - 1/n.",
      id: "mExponent",
      kind: "number",
      label: "m",
    },
    {
      description: "Capillary pressure magnitude in pascals.",
      id: "capillaryPressurePa",
      kind: "number",
      label: "Pc",
    },
  ],
  calculate: (input) =>
    calculateCapillaryPressureVanGenuchten(
      input as unknown as CapillaryPressureVanGenuchtenInput,
    ),
});

export const runCapillaryPressureVanGenuchten =
  capillaryPressureVanGenuchtenTool.execute;
export default capillaryPressureVanGenuchtenTool;
