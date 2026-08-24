import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PalletLoadHeightWithBaseTotalInput = {
  readonly palletBaseHeightCm: number;
  readonly cartonHeightCm: number;
  readonly layerCount: number;
};

export type PalletLoadHeightWithBaseTotalOutput = {
  readonly loadHeightAboveDeckCm: number;
  readonly totalStackHeightCm: number;
};

export const calculatePalletLoadHeightWithBaseTotal = (
  input: PalletLoadHeightWithBaseTotalInput,
): PalletLoadHeightWithBaseTotalOutput => {
  if (
    !Number.isFinite(input.palletBaseHeightCm) ||
    input.palletBaseHeightCm < 0
  )
    return simpleError(
      "palletBaseHeightCm",
      "The pallet base height must be finite and non-negative.",
      "invalid_dimension",
    );
  if (!Number.isFinite(input.cartonHeightCm) || input.cartonHeightCm <= 0)
    return simpleError(
      "cartonHeightCm",
      "The carton height must be finite and greater than zero.",
      "invalid_dimension",
    );
  if (!(Number.isSafeInteger(input.layerCount) && input.layerCount >= 1))
    return simpleError(
      "layerCount",
      "The layer count must be a whole number of at least one.",
      "invalid_layers",
    );
  const loadHeightAboveDeckCm = input.layerCount * input.cartonHeightCm;
  const totalStackHeightCm = input.palletBaseHeightCm + loadHeightAboveDeckCm;
  if (
    !Number.isFinite(loadHeightAboveDeckCm) ||
    !Number.isFinite(totalStackHeightCm)
  )
    return simpleError(
      "layerCount",
      "The stack height is outside the representable range.",
      "height_out_of_range",
    );
  return {
    loadHeightAboveDeckCm,
    totalStackHeightCm,
  };
};

export const palletLoadHeightWithBaseTotalExample = {
  input: { palletBaseHeightCm: 14.4, cartonHeightCm: 28, layerCount: 5 },
  output: { loadHeightAboveDeckCm: 140, totalStackHeightCm: 154.4 },
} satisfies ToolExample<
  PalletLoadHeightWithBaseTotalInput,
  PalletLoadHeightWithBaseTotalOutput
>;

export const palletLoadHeightWithBaseTotalTool = createSimpleTool({
  id: "logistics/pallet-load-height-with-base-total",
  title: "Pallet Load Height with Base Total",
  description:
    "Add the stacked carton layers to the pallet base height to get the total shipping height of the unit load.",
  inputs: [
    {
      description: "Pallet base (deck) height in centimetres.",
      id: "palletBaseHeightCm",
      kind: "number",
      label: "Base height",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Carton height per layer in centimetres.",
      id: "cartonHeightCm",
      kind: "number",
      label: "Carton height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Number of carton layers on the pallet.",
      id: "layerCount",
      kind: "integer",
      label: "Layers",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Load height above the deck in centimetres.",
      id: "loadHeightAboveDeckCm",
      kind: "number",
      label: "Load height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Total unit-load height including the base in centimetres.",
      id: "totalStackHeightCm",
      kind: "number",
      label: "Total height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculatePalletLoadHeightWithBaseTotal({
      cartonHeightCm: input.cartonHeightCm as number,
      layerCount: input.layerCount as number,
      palletBaseHeightCm: input.palletBaseHeightCm as number,
    }),
});

export const runPalletLoadHeightWithBaseTotal =
  palletLoadHeightWithBaseTotalTool.execute;
export default palletLoadHeightWithBaseTotalTool;
