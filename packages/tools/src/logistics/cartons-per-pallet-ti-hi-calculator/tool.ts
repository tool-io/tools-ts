import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CartonsPerPalletTiHiCalculatorInput = {
  readonly palletDeckLengthCm: number;
  readonly palletDeckWidthCm: number;
  readonly usableStackHeightCm: number;
  readonly cartonLengthCm: number;
  readonly cartonWidthCm: number;
  readonly cartonHeightCm: number;
};

export type CartonsPerPalletTiHiCalculatorOutput = {
  readonly tiCartonsPerLayer: number;
  readonly hiLayers: number;
  readonly totalCartonsPerPallet: number;
  readonly chosenOrientation:
    "cartonLengthAlongPalletLength" | "cartonLengthAlongPalletWidth";
};

export const calculateCartonsPerPalletTiHiCalculator = (
  input: CartonsPerPalletTiHiCalculatorInput,
): CartonsPerPalletTiHiCalculatorOutput => {
  for (const key of [
    "palletDeckLengthCm",
    "palletDeckWidthCm",
    "usableStackHeightCm",
    "cartonLengthCm",
    "cartonWidthCm",
    "cartonHeightCm",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Pallet, stack, and carton dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  const orientationA =
    Math.floor(input.palletDeckLengthCm / input.cartonLengthCm) *
    Math.floor(input.palletDeckWidthCm / input.cartonWidthCm);
  const orientationB =
    Math.floor(input.palletDeckLengthCm / input.cartonWidthCm) *
    Math.floor(input.palletDeckWidthCm / input.cartonLengthCm);
  if (
    !Number.isSafeInteger(orientationA) ||
    !Number.isSafeInteger(orientationB)
  )
    return simpleError(
      "cartonWidthCm",
      "The layer carton count is too large to represent safely.",
      "capacity_out_of_range",
    );
  if (orientationA === 0 && orientationB === 0)
    return simpleError(
      "cartonLengthCm",
      "The carton footprint does not fit on the pallet deck.",
      "no_fit",
    );
  const hiLayers = Math.floor(input.usableStackHeightCm / input.cartonHeightCm);
  if (!Number.isSafeInteger(hiLayers))
    return simpleError(
      "cartonHeightCm",
      "The layer count is too large to represent safely.",
      "capacity_out_of_range",
    );
  if (hiLayers === 0)
    return simpleError(
      "cartonHeightCm",
      "The carton is taller than the usable stack height.",
      "no_fit",
    );
  const tiCartonsPerLayer = Math.max(orientationA, orientationB);
  const totalCartonsPerPallet = tiCartonsPerLayer * hiLayers;
  if (!Number.isSafeInteger(totalCartonsPerPallet))
    return simpleError(
      "usableStackHeightCm",
      "The total carton count is too large to represent safely.",
      "capacity_out_of_range",
    );
  return {
    tiCartonsPerLayer,
    hiLayers,
    totalCartonsPerPallet,
    chosenOrientation:
      orientationA >= orientationB
        ? "cartonLengthAlongPalletLength"
        : "cartonLengthAlongPalletWidth",
  };
};

export const cartonsPerPalletTiHiCalculatorExample = {
  input: {
    palletDeckLengthCm: 120,
    palletDeckWidthCm: 100,
    usableStackHeightCm: 180,
    cartonLengthCm: 40,
    cartonWidthCm: 30,
    cartonHeightCm: 25,
  },
  output: {
    tiCartonsPerLayer: 9,
    hiLayers: 7,
    totalCartonsPerPallet: 63,
    chosenOrientation: "cartonLengthAlongPalletLength",
  },
} satisfies ToolExample<
  CartonsPerPalletTiHiCalculatorInput,
  CartonsPerPalletTiHiCalculatorOutput
>;

export const cartonsPerPalletTiHiCalculatorTool = createSimpleTool({
  id: "logistics/cartons-per-pallet-ti-hi-calculator",
  title: "Cartons per Pallet TI-HI Calculator",
  description:
    "Compute pallet TI (whole cartons per layer in the better of two grid orientations) and HI (layers under a usable stack height) with no overhang.",
  inputs: [
    {
      description: "Pallet deck length in centimetres.",
      id: "palletDeckLengthCm",
      kind: "number",
      label: "Deck length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Pallet deck width in centimetres.",
      id: "palletDeckWidthCm",
      kind: "number",
      label: "Deck width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Usable stacking height above the deck in centimetres.",
      id: "usableStackHeightCm",
      kind: "number",
      label: "Stack height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton length in centimetres.",
      id: "cartonLengthCm",
      kind: "number",
      label: "Carton length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton width in centimetres.",
      id: "cartonWidthCm",
      kind: "number",
      label: "Carton width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Carton height in centimetres.",
      id: "cartonHeightCm",
      kind: "number",
      label: "Carton height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "TI: whole cartons per layer.",
      id: "tiCartonsPerLayer",
      kind: "integer",
      label: "TI",
      minimum: 1,
    },
    {
      description: "HI: number of layers that fit the stack height.",
      id: "hiLayers",
      kind: "integer",
      label: "HI",
      minimum: 1,
    },
    {
      description: "Total cartons on the pallet (TI times HI).",
      id: "totalCartonsPerPallet",
      kind: "integer",
      label: "Total",
      minimum: 1,
    },
    {
      description: "Grid orientation used for the best layer count.",
      id: "chosenOrientation",
      enum: ["cartonLengthAlongPalletLength", "cartonLengthAlongPalletWidth"],
      kind: "string",
      label: "Orientation",
    },
  ],
  calculate: (input) =>
    calculateCartonsPerPalletTiHiCalculator({
      cartonHeightCm: input.cartonHeightCm as number,
      cartonLengthCm: input.cartonLengthCm as number,
      cartonWidthCm: input.cartonWidthCm as number,
      palletDeckLengthCm: input.palletDeckLengthCm as number,
      palletDeckWidthCm: input.palletDeckWidthCm as number,
      usableStackHeightCm: input.usableStackHeightCm as number,
    }),
});

export const runCartonsPerPalletTiHiCalculator =
  cartonsPerPalletTiHiCalculatorTool.execute;
export default cartonsPerPalletTiHiCalculatorTool;
