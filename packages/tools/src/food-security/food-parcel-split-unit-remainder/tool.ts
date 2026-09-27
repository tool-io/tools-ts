import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableUnits: number;
  readonly households: number;
  readonly unitsPerParcel: number;
};
export type Output = {
  readonly completeParcels: number;
  readonly servedHouseholds: number;
  readonly remainderUnits: number;
  readonly shortfallHouseholds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableUnits: { type: "integer", minimum: 0 },
    households: { type: "integer", minimum: 0 },
    unitsPerParcel: { type: "integer", minimum: 1 },
  },
  required: ["availableUnits", "households", "unitsPerParcel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completeParcels: { type: "integer" },
    servedHouseholds: { type: "integer" },
    remainderUnits: { type: "integer" },
    shortfallHouseholds: { type: "integer" },
  },
  required: [
    "completeParcels",
    "servedHouseholds",
    "remainderUnits",
    "shortfallHouseholds",
  ],
} as const;
/** Count whole supplied parcel units and households without designing a nutritional allocation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableUnits, households, unitsPerParcel } = request;
  const compute = (): Output => {
    H.integer(availableUnits, 0);
    H.integer(households, 0);
    H.integer(unitsPerParcel, 1);
    const completeParcels = Math.floor(availableUnits / unitsPerParcel),
      servedHouseholds = Math.min(households, completeParcels);
    return {
      completeParcels,
      servedHouseholds,
      remainderUnits: availableUnits % unitsPerParcel,
      shortfallHouseholds: households - servedHouseholds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableUnits: 103, households: 25, unitsPerParcel: 5 },
  output: {
    completeParcels: 20,
    servedHouseholds: 20,
    remainderUnits: 3,
    shortfallHouseholds: 5,
  },
} satisfies ToolExample<Input, Output>;
export const foodParcelSplitUnitRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/food-parcel-split-unit-remainder",
    title: "Food Parcel Split Unit Remainder Tool",
    description:
      "Count whole supplied parcel units and households without designing a nutritional allocation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableUnits: { type: "integer", minimum: 0 },
        households: { type: "integer", minimum: 0 },
        unitsPerParcel: { type: "integer", minimum: 1 },
      },
      required: ["availableUnits", "households", "unitsPerParcel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completeParcels: { type: "integer" },
        servedHouseholds: { type: "integer" },
        remainderUnits: { type: "integer" },
        shortfallHouseholds: { type: "integer" },
      },
      required: [
        "completeParcels",
        "servedHouseholds",
        "remainderUnits",
        "shortfallHouseholds",
      ],
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
          id: "households",
          label: "Households",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerParcel",
          label: "Units Per Parcel",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "completeParcels",
          label: "Complete Parcels",
          valueType: { type: "integer" },
        },
        {
          id: "servedHouseholds",
          label: "Served Households",
          valueType: { type: "integer" },
        },
        {
          id: "remainderUnits",
          label: "Remainder Units",
          valueType: { type: "integer" },
        },
        {
          id: "shortfallHouseholds",
          label: "Shortfall Households",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodParcelSplitUnitRemainderTool.execute;
export default foodParcelSplitUnitRemainderTool;
