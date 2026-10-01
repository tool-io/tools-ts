import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableUnits: number;
  readonly unitsPerPack: number;
  readonly reservedUnits: number;
};
export type Output = {
  readonly fullPacks: number;
  readonly looseUnits: number;
  readonly usableUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableUnits: { type: "integer", minimum: 0 },
    unitsPerPack: { type: "integer", minimum: 1 },
    reservedUnits: { type: "integer", minimum: 0 },
  },
  required: ["availableUnits", "unitsPerPack", "reservedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPacks: { type: "integer" },
    looseUnits: { type: "integer" },
    usableUnits: { type: "integer" },
  },
  required: ["fullPacks", "looseUnits", "usableUnits"],
} as const;
/** Supply inventory packing arithmetic with exact whole-unit remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableUnits, unitsPerPack, reservedUnits } = request;
  const compute = (): Output => {
    H.integer(unitsPerPack, 1);
    H.integer(availableUnits, 0);
    H.integer(reservedUnits, 0, availableUnits);
    const usableUnits = availableUnits - reservedUnits;
    return {
      fullPacks: Math.floor(usableUnits / unitsPerPack),
      looseUnits: usableUnits % unitsPerPack,
      usableUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableUnits: 103, unitsPerPack: 10, reservedUnits: 8 },
  output: { fullPacks: 9, looseUnits: 5, usableUnits: 95 },
} satisfies ToolExample<Input, Output>;
export const supplyCartPackSizeRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/supply-cart-pack-size-remainder",
    title: "Supply Cart Pack Size Remainder Tool",
    description:
      "Supply inventory packing arithmetic with exact whole-unit remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableUnits: { type: "integer", minimum: 0 },
        unitsPerPack: { type: "integer", minimum: 1 },
        reservedUnits: { type: "integer", minimum: 0 },
      },
      required: ["availableUnits", "unitsPerPack", "reservedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPacks: { type: "integer" },
        looseUnits: { type: "integer" },
        usableUnits: { type: "integer" },
      },
      required: ["fullPacks", "looseUnits", "usableUnits"],
    },
    ports: {
      inputs: [
        {
          id: "availableUnits",
          label: "Available Units",
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
          id: "reservedUnits",
          label: "Reserved Units",
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
          id: "usableUnits",
          label: "Usable Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = supplyCartPackSizeRemainderTool.execute;
export default supplyCartPackSizeRemainderTool;
