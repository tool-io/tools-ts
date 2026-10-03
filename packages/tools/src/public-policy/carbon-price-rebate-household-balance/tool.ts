import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emissions: number;
  readonly pricePerUnit: number;
  readonly rebatePerPerson: number;
  readonly persons: number;
};
export type Output = {
  readonly charge: number;
  readonly rebate: number;
  readonly netBurden: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emissions: { type: "number", minimum: 0 },
    pricePerUnit: { type: "number", minimum: 0 },
    rebatePerPerson: { type: "number", minimum: 0 },
    persons: { type: "integer", minimum: 0 },
  },
  required: ["emissions", "pricePerUnit", "rebatePerPerson", "persons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    charge: { type: "number" },
    rebate: { type: "number" },
    netBurden: { type: "number" },
  },
  required: ["charge", "rebate", "netBurden"],
} as const;
/** Calculate carbon price rebate household balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emissions, pricePerUnit, rebatePerPerson, persons } = request;
  const compute = (): Output => {
    H.domain(emissions >= 0 && pricePerUnit >= 0 && rebatePerPerson >= 0);
    H.integer(persons, 0);
    return {
      charge: emissions * pricePerUnit,
      rebate: rebatePerPerson * persons,
      netBurden: emissions * pricePerUnit - rebatePerPerson * persons,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { emissions: 10, pricePerUnit: 50, rebatePerPerson: 100, persons: 3 },
  output: { charge: 500, rebate: 300, netBurden: 200 },
} satisfies ToolExample<Input, Output>;
export const carbonPriceRebateHouseholdBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/carbon-price-rebate-household-balance",
    title: "Carbon Price Rebate Household Balance Tool",
    description:
      "Calculate carbon price rebate household balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        emissions: { type: "number", minimum: 0 },
        pricePerUnit: { type: "number", minimum: 0 },
        rebatePerPerson: { type: "number", minimum: 0 },
        persons: { type: "integer", minimum: 0 },
      },
      required: ["emissions", "pricePerUnit", "rebatePerPerson", "persons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        charge: { type: "number" },
        rebate: { type: "number" },
        netBurden: { type: "number" },
      },
      required: ["charge", "rebate", "netBurden"],
    },
    ports: {
      inputs: [
        {
          id: "emissions",
          label: "Emissions",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerUnit",
          label: "Price Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rebatePerPerson",
          label: "Rebate Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "persons",
          label: "Persons",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "charge", label: "Charge", valueType: { type: "number" } },
        { id: "rebate", label: "Rebate", valueType: { type: "number" } },
        { id: "netBurden", label: "Net Burden", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = carbonPriceRebateHouseholdBalanceTool.execute;
export default carbonPriceRebateHouseholdBalanceTool;
