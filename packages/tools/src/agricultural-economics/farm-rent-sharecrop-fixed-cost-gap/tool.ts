import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossRevenue: number;
  readonly tenantShare: number;
  readonly tenantCosts: number;
  readonly cashRent: number;
};
export type Output = {
  readonly sharecropNet: number;
  readonly cashRentNet: number;
  readonly sharecropAdvantage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossRevenue: { type: "number", minimum: 0 },
    tenantShare: { type: "number", minimum: 0, maximum: 1 },
    tenantCosts: { type: "number", minimum: 0 },
    cashRent: { type: "number", minimum: 0 },
  },
  required: ["grossRevenue", "tenantShare", "tenantCosts", "cashRent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharecropNet: { type: "number" },
    cashRentNet: { type: "number" },
    sharecropAdvantage: { type: "number" },
  },
  required: ["sharecropNet", "cashRentNet", "sharecropAdvantage"],
} as const;
/** Calculate farm rent sharecrop fixed cost gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossRevenue, tenantShare, tenantCosts, cashRent } = request;
  const compute = (): Output => {
    H.domain(grossRevenue >= 0 && tenantCosts >= 0 && cashRent >= 0);
    H.probability(tenantShare);
    const sharecropNet = grossRevenue * tenantShare - tenantCosts;
    const cashRentNet = grossRevenue - tenantCosts - cashRent;
    return {
      sharecropNet,
      cashRentNet,
      sharecropAdvantage: sharecropNet - cashRentNet,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossRevenue: 10000,
    tenantShare: 0.7,
    tenantCosts: 3000,
    cashRent: 4000,
  },
  output: { sharecropNet: 4000, cashRentNet: 3000, sharecropAdvantage: 1000 },
} satisfies ToolExample<Input, Output>;
export const farmRentSharecropFixedCostGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-rent-sharecrop-fixed-cost-gap",
    title: "Farm Rent Sharecrop Fixed Cost Gap Tool",
    description:
      "Calculate farm rent sharecrop fixed cost gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossRevenue: { type: "number", minimum: 0 },
        tenantShare: { type: "number", minimum: 0, maximum: 1 },
        tenantCosts: { type: "number", minimum: 0 },
        cashRent: { type: "number", minimum: 0 },
      },
      required: ["grossRevenue", "tenantShare", "tenantCosts", "cashRent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharecropNet: { type: "number" },
        cashRentNet: { type: "number" },
        sharecropAdvantage: { type: "number" },
      },
      required: ["sharecropNet", "cashRentNet", "sharecropAdvantage"],
    },
    ports: {
      inputs: [
        {
          id: "grossRevenue",
          label: "Gross Revenue",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tenantShare",
          label: "Tenant Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tenantCosts",
          label: "Tenant Costs",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cashRent",
          label: "Cash Rent",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sharecropNet",
          label: "Sharecrop Net",
          valueType: { type: "number" },
        },
        {
          id: "cashRentNet",
          label: "Cash Rent Net",
          valueType: { type: "number" },
        },
        {
          id: "sharecropAdvantage",
          label: "Sharecrop Advantage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmRentSharecropFixedCostGapTool.execute;
export default farmRentSharecropFixedCostGapTool;
