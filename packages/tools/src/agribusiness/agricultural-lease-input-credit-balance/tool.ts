import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashRent: number;
  readonly tenantInputCost: number;
  readonly eligibleFraction: number;
  readonly creditCap: number;
};
export type Output = {
  readonly uncappedCredit: number;
  readonly credit: number;
  readonly rentBalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashRent: { type: "number", minimum: 0 },
    tenantInputCost: { type: "number", minimum: 0 },
    eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
    creditCap: { type: "number", minimum: 0 },
  },
  required: ["cashRent", "tenantInputCost", "eligibleFraction", "creditCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncappedCredit: { type: "number" },
    credit: { type: "number" },
    rentBalance: { type: "number" },
  },
  required: ["uncappedCredit", "credit", "rentBalance"],
} as const;
/** Calculate agricultural lease input credit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cashRent, tenantInputCost, eligibleFraction, creditCap } = request;
  const compute = (): Output => {
    H.domain(cashRent >= 0 && tenantInputCost >= 0 && creditCap >= 0);
    H.probability(eligibleFraction);
    return {
      uncappedCredit: tenantInputCost * eligibleFraction,
      credit: Math.min(cashRent, creditCap, tenantInputCost * eligibleFraction),
      rentBalance:
        cashRent -
        Math.min(cashRent, creditCap, tenantInputCost * eligibleFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cashRent: 1000,
    tenantInputCost: 400,
    eligibleFraction: 0.5,
    creditCap: 150,
  },
  output: { uncappedCredit: 200, credit: 150, rentBalance: 850 },
} satisfies ToolExample<Input, Output>;
export const agriculturalLeaseInputCreditBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agribusiness/agricultural-lease-input-credit-balance",
      title: "Agricultural Lease Input Credit Balance Tool",
      description:
        "Calculate agricultural lease input credit balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cashRent: { type: "number", minimum: 0 },
          tenantInputCost: { type: "number", minimum: 0 },
          eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
          creditCap: { type: "number", minimum: 0 },
        },
        required: [
          "cashRent",
          "tenantInputCost",
          "eligibleFraction",
          "creditCap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          uncappedCredit: { type: "number" },
          credit: { type: "number" },
          rentBalance: { type: "number" },
        },
        required: ["uncappedCredit", "credit", "rentBalance"],
      },
      ports: {
        inputs: [
          {
            id: "cashRent",
            label: "Cash Rent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tenantInputCost",
            label: "Tenant Input Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligibleFraction",
            label: "Eligible Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditCap",
            label: "Credit Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "uncappedCredit",
            label: "Uncapped Credit",
            valueType: { type: "number" },
          },
          { id: "credit", label: "Credit", valueType: { type: "number" } },
          {
            id: "rentBalance",
            label: "Rent Balance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalLeaseInputCreditBalanceTool.execute;
export default agriculturalLeaseInputCreditBalanceTool;
