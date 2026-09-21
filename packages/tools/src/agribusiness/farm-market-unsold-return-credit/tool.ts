import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delivered: number;
  readonly sold: number;
  readonly returned: number;
  readonly unitPrice: number;
  readonly returnCredit: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly invoice: number;
  readonly credit: number;
  readonly net: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delivered: { type: "integer", minimum: 0 },
    sold: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    unitPrice: { type: "number", minimum: 0 },
    returnCredit: { type: "number", minimum: 0 },
  },
  required: ["delivered", "sold", "returned", "unitPrice", "returnCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "integer" },
    invoice: { type: "number" },
    credit: { type: "number" },
    net: { type: "number" },
  },
  required: ["unaccounted", "invoice", "credit", "net"],
} as const;
/** Calculate farm market unsold return credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delivered, sold, returned, unitPrice, returnCredit } = request;
  const compute = (): Output => {
    H.integer(delivered, 0);
    H.integer(sold, 0, delivered);
    H.integer(returned, 0, delivered - sold);
    H.domain(unitPrice >= 0 && returnCredit >= 0);
    return {
      unaccounted: delivered - sold - returned,
      invoice: delivered * unitPrice,
      credit: returned * returnCredit,
      net: delivered * unitPrice - returned * returnCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    delivered: 100,
    sold: 70,
    returned: 20,
    unitPrice: 2,
    returnCredit: 1.5,
  },
  output: { unaccounted: 10, invoice: 200, credit: 30, net: 170 },
} satisfies ToolExample<Input, Output>;
export const farmMarketUnsoldReturnCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-market-unsold-return-credit",
    title: "Farm Market Unsold Return Credit Tool",
    description:
      "Calculate farm market unsold return credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delivered: { type: "integer", minimum: 0 },
        sold: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        unitPrice: { type: "number", minimum: 0 },
        returnCredit: { type: "number", minimum: 0 },
      },
      required: ["delivered", "sold", "returned", "unitPrice", "returnCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unaccounted: { type: "integer" },
        invoice: { type: "number" },
        credit: { type: "number" },
        net: { type: "number" },
      },
      required: ["unaccounted", "invoice", "credit", "net"],
    },
    ports: {
      inputs: [
        {
          id: "delivered",
          label: "Delivered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sold",
          label: "Sold",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitPrice",
          label: "Unit Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnCredit",
          label: "Return Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unaccounted",
          label: "Unaccounted",
          valueType: { type: "integer" },
        },
        { id: "invoice", label: "Invoice", valueType: { type: "number" } },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
        { id: "net", label: "Net", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmMarketUnsoldReturnCreditTool.execute;
export default farmMarketUnsoldReturnCreditTool;
