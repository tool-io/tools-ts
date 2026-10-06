import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returnedQuantity: number;
  readonly creditedUnitPrice: number;
  readonly returnHandlingFee: number;
};
export type Output = {
  readonly grossCredit: number;
  readonly netCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returnedQuantity: { type: "number", minimum: 0 },
    creditedUnitPrice: { type: "number", minimum: 0 },
    returnHandlingFee: { type: "number", minimum: 0 },
  },
  required: ["returnedQuantity", "creditedUnitPrice", "returnHandlingFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCredit: { type: "number" },
    netCredit: { type: "number" },
  },
  required: ["grossCredit", "netCredit"],
} as const;
/** Extend a recorded farm-product return credit net of an explicitly supplied handling fee. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returnedQuantity, creditedUnitPrice, returnHandlingFee } = request;
  const compute = (): Output => {
    H.domain(
      returnedQuantity >= 0 && creditedUnitPrice >= 0 && returnHandlingFee >= 0,
      "returnedQuantity",
    );
    return {
      grossCredit: returnedQuantity * creditedUnitPrice,
      netCredit: returnedQuantity * creditedUnitPrice - returnHandlingFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returnedQuantity: 12, creditedUnitPrice: 5, returnHandlingFee: 4 },
  output: { grossCredit: 60, netCredit: 56 },
} satisfies ToolExample<Input, Output>;
export const farmProductReturnCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agribusiness", "agriculture"],
      keywords: ["agribusiness", "agriculture"],
    },
    id: "agribusiness/farm-product-return-credit",
    title: "Farm Product Return Credit",
    description:
      "Extend a recorded farm-product return credit net of an explicitly supplied handling fee.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returnedQuantity: { type: "number", minimum: 0 },
        creditedUnitPrice: { type: "number", minimum: 0 },
        returnHandlingFee: { type: "number", minimum: 0 },
      },
      required: ["returnedQuantity", "creditedUnitPrice", "returnHandlingFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCredit: { type: "number" },
        netCredit: { type: "number" },
      },
      required: ["grossCredit", "netCredit"],
    },
    ports: {
      inputs: [
        {
          id: "returnedQuantity",
          label: "Returned Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedUnitPrice",
          label: "Credited Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnHandlingFee",
          label: "Return Handling Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossCredit",
          label: "Gross Credit",
          valueType: { type: "number" },
        },
        { id: "netCredit", label: "Net Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmProductReturnCreditTool.execute;
export default farmProductReturnCreditTool;
