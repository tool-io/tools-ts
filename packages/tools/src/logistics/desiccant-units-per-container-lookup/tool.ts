import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DesiccantUnitsPerContainerLookupInput = {
  readonly cargoVolumeM3: number;
  readonly moistureExposureGramsPerM3: number;
  readonly gramsAbsorbedPerUnit: number;
};

export type DesiccantUnitsPerContainerLookupOutput = {
  readonly waterToBindGrams: number;
  readonly desiccantUnitsNeeded: number;
};

export const calculateDesiccantUnitsPerContainerLookup = (
  input: DesiccantUnitsPerContainerLookupInput,
): DesiccantUnitsPerContainerLookupOutput => {
  if (!Number.isFinite(input.cargoVolumeM3) || input.cargoVolumeM3 <= 0)
    return simpleError(
      "cargoVolumeM3",
      "The cargo volume must be finite and greater than zero.",
      "invalid_volume",
    );
  if (
    !Number.isFinite(input.moistureExposureGramsPerM3) ||
    input.moistureExposureGramsPerM3 <= 0
  )
    return simpleError(
      "moistureExposureGramsPerM3",
      "The moisture exposure factor must be finite and greater than zero.",
      "invalid_factor",
    );
  if (
    !Number.isFinite(input.gramsAbsorbedPerUnit) ||
    input.gramsAbsorbedPerUnit <= 0
  )
    return simpleError(
      "gramsAbsorbedPerUnit",
      "The per-unit absorption rating must be finite and greater than zero.",
      "invalid_rating",
    );
  const waterToBindGrams =
    input.cargoVolumeM3 * input.moistureExposureGramsPerM3;
  const requiredUnits = waterToBindGrams / input.gramsAbsorbedPerUnit;
  const desiccantUnitsNeeded = Math.ceil(requiredUnits);
  if (
    !Number.isFinite(waterToBindGrams) ||
    waterToBindGrams <= 0 ||
    !Number.isFinite(requiredUnits) ||
    requiredUnits <= 0 ||
    !Number.isSafeInteger(desiccantUnitsNeeded)
  )
    return simpleError(
      "cargoVolumeM3",
      "The desiccant requirement is outside the representable range.",
      "requirement_out_of_range",
    );
  return {
    waterToBindGrams,
    desiccantUnitsNeeded,
  };
};

export const desiccantUnitsPerContainerLookupExample = {
  input: {
    cargoVolumeM3: 33.2,
    moistureExposureGramsPerM3: 20,
    gramsAbsorbedPerUnit: 12,
  },
  output: { waterToBindGrams: 664, desiccantUnitsNeeded: 56 },
} satisfies ToolExample<
  DesiccantUnitsPerContainerLookupInput,
  DesiccantUnitsPerContainerLookupOutput
>;

export const desiccantUnitsPerContainerLookupTool = createSimpleTool({
  id: "logistics/desiccant-units-per-container-lookup",
  title: "Desiccant Units per Container Lookup",
  description:
    "Divide the water your hygiene spec says must be bound (volume times exposure factor) by the rated grams absorbed per desiccant unit and round up to whole units.",
  inputs: [
    {
      description:
        "Air volume of the loaded container or shipment in cubic metres.",
      id: "cargoVolumeM3",
      kind: "number",
      label: "Volume",
      minimum: Number.MIN_VALUE,
      unit: "m³",
    },
    {
      description:
        "Grams of water that must be absorbed per cubic metre, from your moisture protection specification.",
      id: "moistureExposureGramsPerM3",
      kind: "number",
      label: "Exposure",
      minimum: Number.MIN_VALUE,
      unit: "g/m³",
    },
    {
      description:
        "Rated grams of moisture one desiccant unit absorbs under the specification's conditions.",
      id: "gramsAbsorbedPerUnit",
      kind: "number",
      label: "Absorption",
      minimum: Number.MIN_VALUE,
      unit: "g/unit",
    },
  ],
  outputs: [
    {
      description: "Total grams of water to bind.",
      id: "waterToBindGrams",
      kind: "number",
      label: "Water",
      minimum: Number.MIN_VALUE,
      unit: "g",
    },
    {
      description: "Whole desiccant units required (rounded up).",
      id: "desiccantUnitsNeeded",
      kind: "integer",
      label: "Units",
      minimum: 1,
    },
  ],
  calculate: (input) =>
    calculateDesiccantUnitsPerContainerLookup({
      cargoVolumeM3: input.cargoVolumeM3 as number,
      gramsAbsorbedPerUnit: input.gramsAbsorbedPerUnit as number,
      moistureExposureGramsPerM3: input.moistureExposureGramsPerM3 as number,
    }),
});

export const runDesiccantUnitsPerContainerLookup =
  desiccantUnitsPerContainerLookupTool.execute;
export default desiccantUnitsPerContainerLookupTool;
