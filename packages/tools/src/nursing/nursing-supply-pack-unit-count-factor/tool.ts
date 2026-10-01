import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartons: number;
  readonly packsPerCarton: number;
  readonly unitsPerPack: number;
  readonly openedPacks: number;
  readonly looseUnits: number;
};
export type Output = {
  readonly sealedUnits: number;
  readonly totalUnits: number;
  readonly packEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartons: { type: "integer", minimum: 0 },
    packsPerCarton: { type: "integer", minimum: 1 },
    unitsPerPack: { type: "integer", minimum: 1 },
    openedPacks: { type: "integer", minimum: 0 },
    looseUnits: { type: "integer", minimum: 0 },
  },
  required: [
    "cartons",
    "packsPerCarton",
    "unitsPerPack",
    "openedPacks",
    "looseUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealedUnits: { type: "integer" },
    totalUnits: { type: "integer" },
    packEquivalent: { type: "number" },
  },
  required: ["sealedUnits", "totalUnits", "packEquivalent"],
} as const;
/** Calculate nursing supply pack unit count factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartons, packsPerCarton, unitsPerPack, openedPacks, looseUnits } =
    request;
  const compute = (): Output => {
    H.integer(cartons, 0);
    H.integer(packsPerCarton, 1);
    H.integer(unitsPerPack, 1);
    H.integer(openedPacks, 0, cartons * packsPerCarton);
    H.integer(looseUnits, 0);
    return {
      sealedUnits: (cartons * packsPerCarton - openedPacks) * unitsPerPack,
      totalUnits:
        (cartons * packsPerCarton - openedPacks) * unitsPerPack + looseUnits,
      packEquivalent:
        cartons * packsPerCarton - openedPacks + looseUnits / unitsPerPack,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cartons: 2,
    packsPerCarton: 5,
    unitsPerPack: 10,
    openedPacks: 3,
    looseUnits: 7,
  },
  output: { sealedUnits: 70, totalUnits: 77, packEquivalent: 7.7 },
} satisfies ToolExample<Input, Output>;
export const nursingSupplyPackUnitCountFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/nursing-supply-pack-unit-count-factor",
    title: "Nursing Supply Pack Unit Count Factor Tool",
    description:
      "Calculate nursing supply pack unit count factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartons: { type: "integer", minimum: 0 },
        packsPerCarton: { type: "integer", minimum: 1 },
        unitsPerPack: { type: "integer", minimum: 1 },
        openedPacks: { type: "integer", minimum: 0 },
        looseUnits: { type: "integer", minimum: 0 },
      },
      required: [
        "cartons",
        "packsPerCarton",
        "unitsPerPack",
        "openedPacks",
        "looseUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealedUnits: { type: "integer" },
        totalUnits: { type: "integer" },
        packEquivalent: { type: "number" },
      },
      required: ["sealedUnits", "totalUnits", "packEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "cartons",
          label: "Cartons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "packsPerCarton",
          label: "Packs Per Carton",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "openedPacks",
          label: "Opened Packs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "sealedUnits",
          label: "Sealed Units",
          valueType: { type: "integer" },
        },
        {
          id: "totalUnits",
          label: "Total Units",
          valueType: { type: "integer" },
        },
        {
          id: "packEquivalent",
          label: "Pack Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nursingSupplyPackUnitCountFactorTool.execute;
export default nursingSupplyPackUnitCountFactorTool;
