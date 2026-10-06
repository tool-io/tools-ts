import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossPrice: number;
  readonly suppliedCommissionFraction: number;
};
export type Output = { readonly commission: number; readonly netPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPrice: { type: "number", minimum: 0 },
    suppliedCommissionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["grossPrice", "suppliedCommissionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { commission: { type: "number" }, netPrice: { type: "number" } },
  required: ["commission", "netPrice"],
} as const;
/** Apply a supplied commission fraction to one produce sale price without choosing brokerage terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossPrice, suppliedCommissionFraction } = request;
  const compute = (): Output => {
    H.domain(grossPrice >= 0, "grossPrice");
    (H.domain(
      suppliedCommissionFraction >= 0 && suppliedCommissionFraction <= 1,
      "suppliedCommissionFraction",
    ),
      suppliedCommissionFraction);
    return {
      commission: grossPrice * suppliedCommissionFraction,
      netPrice: grossPrice * (1 - suppliedCommissionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossPrice: 200, suppliedCommissionFraction: 0.05 },
  output: { commission: 10, netPrice: 190 },
} satisfies ToolExample<Input, Output>;
export const farmproduceCommissionNetPriceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-produce-commission-net-price",
    title: "Farm Produce Commission Net Price",
    description:
      "Apply a supplied commission fraction to one produce sale price without choosing brokerage terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPrice: { type: "number", minimum: 0 },
        suppliedCommissionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["grossPrice", "suppliedCommissionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commission: { type: "number" },
        netPrice: { type: "number" },
      },
      required: ["commission", "netPrice"],
    },
    ports: {
      inputs: [
        {
          id: "grossPrice",
          label: "Gross Price",
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
          id: "commission",
          label: "Commission",
          valueType: { type: "number" },
        },
        { id: "netPrice", label: "Net Price", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmproduceCommissionNetPriceTool.execute;
export default farmproduceCommissionNetPriceTool;
