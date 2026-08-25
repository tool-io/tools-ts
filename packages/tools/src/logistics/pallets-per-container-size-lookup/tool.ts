import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PalletsPerContainerSizeLookupInput = {
  readonly containerInternalLengthCm: number;
  readonly containerInternalWidthCm: number;
  readonly palletLengthCm: number;
  readonly palletWidthCm: number;
  readonly stackingLayers?: number;
};

export type PalletsPerContainerSizeLookupOutput = {
  readonly palletsPerTier: number;
  readonly maximumPallets: number;
  readonly chosenOrientation:
    "palletLengthAlongContainerLength" | "palletLengthAlongContainerWidth";
};

export const calculatePalletsPerContainerSizeLookup = (
  input: PalletsPerContainerSizeLookupInput,
): PalletsPerContainerSizeLookupOutput => {
  for (const key of [
    "containerInternalLengthCm",
    "containerInternalWidthCm",
    "palletLengthCm",
    "palletWidthCm",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Container and pallet dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const stackingLayers = input.stackingLayers ?? 1;
  if (!(Number.isSafeInteger(stackingLayers) && stackingLayers >= 1))
    return simpleError(
      "stackingLayers",
      "The layer count must be a whole number of at least one.",
      "invalid_layers",
    );
  const lengthAlongLength =
    Math.floor(input.containerInternalLengthCm / input.palletLengthCm) *
    Math.floor(input.containerInternalWidthCm / input.palletWidthCm);
  const lengthAlongWidth =
    Math.floor(input.containerInternalLengthCm / input.palletWidthCm) *
    Math.floor(input.containerInternalWidthCm / input.palletLengthCm);
  if (lengthAlongLength === 0 && lengthAlongWidth === 0)
    return simpleError(
      "palletLengthCm",
      "The pallet footprint does not fit inside the container floor.",
      "no_fit",
    );
  const palletsPerTier = Math.max(lengthAlongLength, lengthAlongWidth);
  const maximumPallets = palletsPerTier * stackingLayers;
  if (!(
    Number.isSafeInteger(palletsPerTier) && Number.isSafeInteger(maximumPallets)
  ))
    return simpleError(
      "palletLengthCm",
      "The pallet count is outside the safe integer range.",
      "count_out_of_range",
    );
  return {
    palletsPerTier,
    maximumPallets,
    chosenOrientation:
      lengthAlongLength >= lengthAlongWidth
        ? "palletLengthAlongContainerLength"
        : "palletLengthAlongContainerWidth",
  };
};

export const palletsPerContainerSizeLookupExample = {
  input: {
    containerInternalLengthCm: 589,
    containerInternalWidthCm: 235,
    palletLengthCm: 120,
    palletWidthCm: 80,
  },
  output: {
    palletsPerTier: 8,
    maximumPallets: 8,
    chosenOrientation: "palletLengthAlongContainerLength",
  },
} satisfies ToolExample<
  PalletsPerContainerSizeLookupInput,
  PalletsPerContainerSizeLookupOutput
>;

export const palletsPerContainerSizeLookupTool = createSimpleTool({
  id: "logistics/pallets-per-container-size-lookup",
  title: "Pallets per Container Size Lookup",
  description:
    "Fit whole pallets onto the container floor with a straight grid in the better of two orientations (no interlocking) and scale by stackable layers.",
  inputs: [
    {
      description: "Container internal floor length in centimetres.",
      id: "containerInternalLengthCm",
      kind: "number",
      label: "Cont. length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Container internal floor width in centimetres.",
      id: "containerInternalWidthCm",
      kind: "number",
      label: "Cont. width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Pallet length in centimetres.",
      id: "palletLengthCm",
      kind: "number",
      label: "Pallet length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Pallet width in centimetres.",
      id: "palletWidthCm",
      kind: "number",
      label: "Pallet width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 1,
      description: "Number of stackable layers on each floor position.",
      id: "stackingLayers",
      kind: "integer",
      label: "Layers",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Whole pallet positions available on one floor tier.",
      id: "palletsPerTier",
      kind: "integer",
      label: "Per tier",
    },
    {
      description: "Total pallets across all stackable layers.",
      id: "maximumPallets",
      kind: "integer",
      label: "Max pallets",
    },
    {
      description: "Orientation that produced the best fit.",
      id: "chosenOrientation",
      enum: [
        "palletLengthAlongContainerLength",
        "palletLengthAlongContainerWidth",
      ],
      kind: "string",
      label: "Orientation",
    },
  ],
  calculate: (input) =>
    calculatePalletsPerContainerSizeLookup({
      containerInternalLengthCm: input.containerInternalLengthCm as number,
      containerInternalWidthCm: input.containerInternalWidthCm as number,
      palletLengthCm: input.palletLengthCm as number,
      palletWidthCm: input.palletWidthCm as number,
      stackingLayers: input.stackingLayers as number | undefined,
    }),
});

export const runPalletsPerContainerSizeLookup =
  palletsPerContainerSizeLookupTool.execute;
export default palletsPerContainerSizeLookupTool;
