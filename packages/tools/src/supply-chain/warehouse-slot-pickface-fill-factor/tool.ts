import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly units: number;
  readonly unitVolume: number;
  readonly slotVolume: number;
  readonly reservedVolume: number;
};
export type Output = {
  readonly usableVolume: number;
  readonly occupiedVolume: number;
  readonly fillFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    units: { type: "integer", minimum: 0 },
    unitVolume: { type: "number", minimum: 0 },
    slotVolume: { type: "number" },
    reservedVolume: { type: "number", minimum: 0 },
  },
  required: ["units", "unitVolume", "slotVolume", "reservedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableVolume: { type: "number" },
    occupiedVolume: { type: "number" },
    fillFraction: { type: "number" },
  },
  required: ["usableVolume", "occupiedVolume", "fillFraction"],
} as const;
/** Volume utilization alone, without asserting geometric packability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { units, unitVolume, slotVolume, reservedVolume } = request;
  const compute = (): Output => {
    H.integer(units, 0);
    H.domain(
      unitVolume >= 0 && reservedVolume >= 0 && slotVolume > reservedVolume,
    );
    return {
      usableVolume: slotVolume - reservedVolume,
      occupiedVolume: units * unitVolume,
      fillFraction: (units * unitVolume) / (slotVolume - reservedVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { units: 20, unitVolume: 0.1, slotVolume: 4, reservedVolume: 1 },
  output: {
    usableVolume: 3,
    occupiedVolume: 2,
    fillFraction: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const warehouseSlotPickfaceFillFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/warehouse-slot-pickface-fill-factor",
    title: "Warehouse Slot Pickface Fill Factor Tool",
    description:
      "Volume utilization alone, without asserting geometric packability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        units: { type: "integer", minimum: 0 },
        unitVolume: { type: "number", minimum: 0 },
        slotVolume: { type: "number" },
        reservedVolume: { type: "number", minimum: 0 },
      },
      required: ["units", "unitVolume", "slotVolume", "reservedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableVolume: { type: "number" },
        occupiedVolume: { type: "number" },
        fillFraction: { type: "number" },
      },
      required: ["usableVolume", "occupiedVolume", "fillFraction"],
    },
    ports: {
      inputs: [
        {
          id: "units",
          label: "Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitVolume",
          label: "Unit Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "slotVolume",
          label: "Slot Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedVolume",
          label: "Reserved Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableVolume",
          label: "Usable Volume",
          valueType: { type: "number" },
        },
        {
          id: "occupiedVolume",
          label: "Occupied Volume",
          valueType: { type: "number" },
        },
        {
          id: "fillFraction",
          label: "Fill Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = warehouseSlotPickfaceFillFactorTool.execute;
export default warehouseSlotPickfaceFillFactorTool;
