import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly items: number;
  readonly households: number;
  readonly reserved: number;
};
export type Output = {
  readonly perHousehold: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: { type: "integer", minimum: 0 },
    households: { type: "integer", minimum: 1 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["items", "households", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perHousehold: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["perHousehold", "remainder"],
} as const;
/** Calculate urban harvest household share rounding from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { items, households, reserved } = request;
  const compute = (): Output => {
    H.integer(items, 0);
    H.integer(households, 1);
    H.integer(reserved, 0, items);
    return {
      perHousehold: Math.floor((items - reserved) / households),
      remainder: (items - reserved) % households,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { items: 103, households: 10, reserved: 3 },
  output: { perHousehold: 10, remainder: 0 },
} satisfies ToolExample<Input, Output>;
export const urbanHarvestHouseholdShareRoundingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-harvest-household-share-rounding",
    title: "Urban Harvest Household Share Rounding Tool",
    description:
      "Calculate urban harvest household share rounding from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        items: { type: "integer", minimum: 0 },
        households: { type: "integer", minimum: 1 },
        reserved: { type: "integer", minimum: 0 },
      },
      required: ["items", "households", "reserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perHousehold: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["perHousehold", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "items",
          label: "Items",
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
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "perHousehold",
          label: "Per Household",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = urbanHarvestHouseholdShareRoundingTool.execute;
export default urbanHarvestHouseholdShareRoundingTool;
