import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly domesticPrice: number;
  readonly worldPrice: number;
  readonly ordinaryTariff: number;
  readonly licenseCost: number;
  readonly licensedUnits: number;
};
export type Output = {
  readonly grossRentPerUnit: number;
  readonly netRentPerUnit: number;
  readonly netRentTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticPrice: { type: "number" },
    worldPrice: { type: "number" },
    ordinaryTariff: { type: "number" },
    licenseCost: { type: "number" },
    licensedUnits: { type: "number", minimum: 0 },
  },
  required: [
    "domesticPrice",
    "worldPrice",
    "ordinaryTariff",
    "licenseCost",
    "licensedUnits",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRentPerUnit: { type: "number" },
    netRentPerUnit: { type: "number" },
    netRentTotal: { type: "number" },
  },
  required: ["grossRentPerUnit", "netRentPerUnit", "netRentTotal"],
} as const;
/** Per-unit quota price wedge and explicit license cost, without estimating market price or entitlement to quota rents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    domesticPrice,
    worldPrice,
    ordinaryTariff,
    licenseCost,
    licensedUnits,
  } = request;
  const compute = (): Output => {
    H.domain(licensedUnits >= 0);
    return {
      grossRentPerUnit: domesticPrice - worldPrice - ordinaryTariff,
      netRentPerUnit: domesticPrice - worldPrice - ordinaryTariff - licenseCost,
      netRentTotal:
        (domesticPrice - worldPrice - ordinaryTariff - licenseCost) *
        licensedUnits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    domesticPrice: 150,
    worldPrice: 100,
    ordinaryTariff: 10,
    licenseCost: 5,
    licensedUnits: 1000,
  },
  output: { grossRentPerUnit: 40, netRentPerUnit: 35, netRentTotal: 35000 },
} satisfies ToolExample<Input, Output>;
export const tariffQuotaRentPerLicensedUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/tariff-quota-rent-per-licensed-unit",
    title: "Tariff Quota Rent Per Licensed Unit Tool",
    description:
      "Per-unit quota price wedge and explicit license cost, without estimating market price or entitlement to quota rents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domesticPrice: { type: "number" },
        worldPrice: { type: "number" },
        ordinaryTariff: { type: "number" },
        licenseCost: { type: "number" },
        licensedUnits: { type: "number", minimum: 0 },
      },
      required: [
        "domesticPrice",
        "worldPrice",
        "ordinaryTariff",
        "licenseCost",
        "licensedUnits",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRentPerUnit: { type: "number" },
        netRentPerUnit: { type: "number" },
        netRentTotal: { type: "number" },
      },
      required: ["grossRentPerUnit", "netRentPerUnit", "netRentTotal"],
    },
    ports: {
      inputs: [
        {
          id: "domesticPrice",
          label: "Domestic Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "worldPrice",
          label: "World Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ordinaryTariff",
          label: "Ordinary Tariff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "licenseCost",
          label: "License Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "licensedUnits",
          label: "Licensed Units",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossRentPerUnit",
          label: "Gross Rent Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "netRentPerUnit",
          label: "Net Rent Per Unit",
          valueType: { type: "number" },
        },
        {
          id: "netRentTotal",
          label: "Net Rent Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tariffQuotaRentPerLicensedUnitTool.execute;
export default tariffQuotaRentPerLicensedUnitTool;
