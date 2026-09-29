import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goods: number;
  readonly freight: number;
  readonly discount: number;
  readonly rate: number;
  readonly includeFreight: boolean;
};
export type Output = {
  readonly taxableBase: number;
  readonly vat: number;
  readonly invoiceTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goods: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    discount: { type: "number", minimum: 0 },
    rate: { type: "number", minimum: 0 },
    includeFreight: { type: "boolean" },
  },
  required: ["goods", "freight", "discount", "rate", "includeFreight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxableBase: { type: "number" },
    vat: { type: "number" },
    invoiceTotal: { type: "number" },
  },
  required: ["taxableBase", "vat", "invoiceTotal"],
} as const;
/** Explicit caller-defined tax base; no country, place-of-supply or export VAT treatment is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goods, freight, discount, rate, includeFreight } = request;
  const compute = (): Output => {
    H.domain(
      goods >= 0 &&
        freight >= 0 &&
        discount >= 0 &&
        discount <= goods &&
        rate >= 0,
    );
    return {
      taxableBase: goods - discount + (includeFreight ? freight : 0),
      vat: (goods - discount + (includeFreight ? freight : 0)) * rate,
      invoiceTotal:
        goods +
        freight -
        discount +
        (goods - discount + (includeFreight ? freight : 0)) * rate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    goods: 1000,
    freight: 100,
    discount: 50,
    rate: 0.2,
    includeFreight: true,
  },
  output: { taxableBase: 1050, vat: 210, invoiceTotal: 1260 },
} satisfies ToolExample<Input, Output>;
export const overseasSalesVatCallerBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/overseas-sales-vat-caller-base",
    title: "Overseas Sales Vat Caller Base Tool",
    description:
      "Explicit caller-defined tax base; no country, place-of-supply or export VAT treatment is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goods: { type: "number", minimum: 0 },
        freight: { type: "number", minimum: 0 },
        discount: { type: "number", minimum: 0 },
        rate: { type: "number", minimum: 0 },
        includeFreight: { type: "boolean" },
      },
      required: ["goods", "freight", "discount", "rate", "includeFreight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxableBase: { type: "number" },
        vat: { type: "number" },
        invoiceTotal: { type: "number" },
      },
      required: ["taxableBase", "vat", "invoiceTotal"],
    },
    ports: {
      inputs: [
        {
          id: "goods",
          label: "Goods",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freight",
          label: "Freight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discount",
          label: "Discount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeFreight",
          label: "Include Freight",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "taxableBase",
          label: "Taxable Base",
          valueType: { type: "number" },
        },
        { id: "vat", label: "Vat", valueType: { type: "number" } },
        {
          id: "invoiceTotal",
          label: "Invoice Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = overseasSalesVatCallerBaseTool.execute;
export default overseasSalesVatCallerBaseTool;
