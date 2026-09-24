import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockUnits: number;
  readonly reservedUnits: number;
  readonly unitsPerPack: number;
};
export type Output = {
  readonly fullPacks: number;
  readonly looseUnits: number;
  readonly availableUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockUnits: { type: "integer", minimum: 0 },
    reservedUnits: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
  },
  required: ["stockUnits", "reservedUnits", "unitsPerPack"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPacks: { type: "integer" },
    looseUnits: { type: "integer" },
    availableUnits: { type: "integer" },
  },
  required: ["fullPacks", "looseUnits", "availableUnits"],
} as const;
/** Supply inventory pack/remainder arithmetic without dose or dispensing guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockUnits, reservedUnits, unitsPerPack } = request;
  const compute = (): Output => {
    H.integer(stockUnits, 0);
    H.integer(reservedUnits, 0, stockUnits);
    H.integer(unitsPerPack, 1);
    const availableUnits = stockUnits - reservedUnits;
    return {
      fullPacks: Math.floor(availableUnits / unitsPerPack),
      looseUnits: availableUnits % unitsPerPack,
      availableUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockUnits: 103, reservedUnits: 8, unitsPerPack: 10 },
  output: { fullPacks: 9, looseUnits: 5, availableUnits: 95 },
} satisfies ToolExample<Input, Output>;
export const shelfStockPackRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-pharmacy/shelf-stock-pack-remainder",
    title: "Shelf Stock Pack Remainder Tool",
    description:
      "Supply inventory pack/remainder arithmetic without dose or dispensing guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockUnits: { type: "integer", minimum: 0 },
        reservedUnits: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
      },
      required: ["stockUnits", "reservedUnits", "unitsPerPack"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPacks: { type: "integer" },
        looseUnits: { type: "integer" },
        availableUnits: { type: "integer" },
      },
      required: ["fullPacks", "looseUnits", "availableUnits"],
    },
    ports: {
      inputs: [
        {
          id: "stockUnits",
          label: "Stock Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedUnits",
          label: "Reserved Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerPack",
          label: "Units Per Pack",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullPacks",
          label: "Full Packs",
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          valueType: { type: "integer" },
        },
        {
          id: "availableUnits",
          label: "Available Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = shelfStockPackRemainderTool.execute;
export default shelfStockPackRemainderTool;
