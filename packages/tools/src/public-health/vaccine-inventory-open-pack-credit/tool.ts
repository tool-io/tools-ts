import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sealedPacks: number;
  readonly unitsPerPack: number;
  readonly openUnits: number;
  readonly countOpen: boolean;
};
export type Output = {
  readonly inventoryUnits: number;
  readonly creditedOpenUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sealedPacks: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
    openUnits: { type: "integer", minimum: 0 },
    countOpen: { type: "boolean" },
  },
  required: ["sealedPacks", "unitsPerPack", "openUnits", "countOpen"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inventoryUnits: { type: "integer" },
    creditedOpenUnits: { type: "integer" },
  },
  required: ["inventoryUnits", "creditedOpenUnits"],
} as const;
/** Inventory unit arithmetic under a supplied open-pack credit policy; does not determine usability, storage or administration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sealedPacks, unitsPerPack, openUnits, countOpen } = request;
  const compute = (): Output => {
    H.integer(sealedPacks, 0);
    H.integer(unitsPerPack, 1);
    H.integer(openUnits, 0);
    const creditedOpenUnits = countOpen ? openUnits : 0;
    return {
      inventoryUnits: Number(
        BigInt(sealedPacks) * BigInt(unitsPerPack) + BigInt(creditedOpenUnits),
      ),
      creditedOpenUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sealedPacks: 10, unitsPerPack: 5, openUnits: 3, countOpen: true },
  output: { inventoryUnits: 53, creditedOpenUnits: 3 },
} satisfies ToolExample<Input, Output>;
export const vaccineInventoryOpenPackCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-health/vaccine-inventory-open-pack-credit",
    title: "Vaccine Inventory Open Pack Credit Tool",
    description:
      "Inventory unit arithmetic under a supplied open-pack credit policy; does not determine usability, storage or administration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sealedPacks: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
        openUnits: { type: "integer", minimum: 0 },
        countOpen: { type: "boolean" },
      },
      required: ["sealedPacks", "unitsPerPack", "openUnits", "countOpen"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inventoryUnits: { type: "integer" },
        creditedOpenUnits: { type: "integer" },
      },
      required: ["inventoryUnits", "creditedOpenUnits"],
    },
    ports: {
      inputs: [
        {
          id: "sealedPacks",
          label: "Sealed Packs",
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
          id: "openUnits",
          label: "Open Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countOpen",
          label: "Count Open",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "inventoryUnits",
          label: "Inventory Units",
          valueType: { type: "integer" },
        },
        {
          id: "creditedOpenUnits",
          label: "Credited Open Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaccineInventoryOpenPackCreditTool.execute;
export default vaccineInventoryOpenPackCreditTool;
