import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossSales: number;
  readonly commissionFraction: number;
  readonly refunds: number;
  readonly sellerFees: number;
};
export type Output = {
  readonly netSales: number;
  readonly commission: number;
  readonly sellerDue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSales: { type: "number" },
    commissionFraction: { type: "number", minimum: 0, maximum: 1 },
    refunds: { type: "number", minimum: 0 },
    sellerFees: { type: "number", minimum: 0 },
  },
  required: ["grossSales", "commissionFraction", "refunds", "sellerFees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netSales: { type: "number" },
    commission: { type: "number" },
    sellerDue: { type: "number" },
  },
  required: ["netSales", "commission", "sellerDue"],
} as const;
/** Calculate farm shop consignment net settlement from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossSales, commissionFraction, refunds, sellerFees } = request;
  const compute = (): Output => {
    H.domain(refunds >= 0 && grossSales >= refunds && sellerFees >= 0);
    H.probability(commissionFraction);
    return {
      netSales: grossSales - refunds,
      commission: (grossSales - refunds) * commissionFraction,
      sellerDue: (grossSales - refunds) * (1 - commissionFraction) - sellerFees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossSales: 1000,
    commissionFraction: 0.2,
    refunds: 100,
    sellerFees: 20,
  },
  output: { netSales: 900, commission: 180, sellerDue: 700 },
} satisfies ToolExample<Input, Output>;
export const farmShopConsignmentNetSettlementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-shop-consignment-net-settlement",
    title: "Farm Shop Consignment Net Settlement Tool",
    description:
      "Calculate farm shop consignment net settlement from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSales: { type: "number" },
        commissionFraction: { type: "number", minimum: 0, maximum: 1 },
        refunds: { type: "number", minimum: 0 },
        sellerFees: { type: "number", minimum: 0 },
      },
      required: ["grossSales", "commissionFraction", "refunds", "sellerFees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netSales: { type: "number" },
        commission: { type: "number" },
        sellerDue: { type: "number" },
      },
      required: ["netSales", "commission", "sellerDue"],
    },
    ports: {
      inputs: [
        {
          id: "grossSales",
          label: "Gross Sales",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commissionFraction",
          label: "Commission Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refunds",
          label: "Refunds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sellerFees",
          label: "Seller Fees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netSales", label: "Net Sales", valueType: { type: "number" } },
        {
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
        { id: "sellerDue", label: "Seller Due", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmShopConsignmentNetSettlementTool.execute;
export default farmShopConsignmentNetSettlementTool;
