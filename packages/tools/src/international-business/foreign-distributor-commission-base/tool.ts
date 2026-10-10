import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossSales: number;
  readonly excludedSales: number;
  readonly suppliedCommissionFraction: number;
};
export type Output = {
  readonly commissionBase: number;
  readonly commission: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSales: { type: "number", minimum: 0 },
    excludedSales: { type: "number", minimum: 0 },
    suppliedCommissionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossSales", "excludedSales", "suppliedCommissionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commissionBase: { type: "number" },
    commission: { type: "number" },
  },
  required: ["commissionBase", "commission"],
} as const;
/** Apply an explicit commission fraction to a caller-defined eligible sales base without interpreting a distributor agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossSales, excludedSales, suppliedCommissionFraction } = request;
  const compute = (): Output => {
    H.domain(
      grossSales >= 0 && excludedSales >= 0 && excludedSales <= grossSales,
      "grossSales",
    );
    (H.domain(
      suppliedCommissionFraction >= 0 && suppliedCommissionFraction <= 1,
      "suppliedCommissionFraction",
    ),
      suppliedCommissionFraction);
    return {
      commissionBase: grossSales - excludedSales,
      commission: (grossSales - excludedSales) * suppliedCommissionFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossSales: 10000,
    excludedSales: 2000,
    suppliedCommissionFraction: 0.1,
  },
  output: { commissionBase: 8000, commission: 800 },
} satisfies ToolExample<Input, Output>;
export const foreignDistributorCommissionBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-business",
        "international business",
        "business and finance",
      ],
      keywords: ["international business", "business and finance"],
    },
    id: "international-business/foreign-distributor-commission-base",
    title: "Foreign Distributor Commission Base",
    description:
      "Apply an explicit commission fraction to a caller-defined eligible sales base without interpreting a distributor agreement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSales: { type: "number", minimum: 0 },
        excludedSales: { type: "number", minimum: 0 },
        suppliedCommissionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossSales", "excludedSales", "suppliedCommissionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commissionBase: { type: "number" },
        commission: { type: "number" },
      },
      required: ["commissionBase", "commission"],
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
          id: "excludedSales",
          label: "Excluded Sales",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCommissionFraction",
          label: "Supplied Commission Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commissionBase",
          label: "Commission Base",
          valueType: { type: "number" },
        },
        {
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foreignDistributorCommissionBaseTool.execute;
export default foreignDistributorCommissionBaseTool;
