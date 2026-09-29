import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly customsValue: number;
  readonly dutyRate: number;
  readonly excise: number;
  readonly taxRate: number;
  readonly includeDutyInTax: boolean;
};
export type Output = {
  readonly duty: number;
  readonly taxBase: number;
  readonly tax: number;
  readonly landedTaxTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    customsValue: { type: "number", minimum: 0 },
    dutyRate: { type: "number", minimum: 0 },
    excise: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    includeDutyInTax: { type: "boolean" },
  },
  required: [
    "customsValue",
    "dutyRate",
    "excise",
    "taxRate",
    "includeDutyInTax",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duty: { type: "number" },
    taxBase: { type: "number" },
    tax: { type: "number" },
    landedTaxTotal: { type: "number" },
  },
  required: ["duty", "taxBase", "tax", "landedTaxTotal"],
} as const;
/** Explicit supplied customs duty and tax-base sequence, without jurisdictional tariff or tax-rule lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { customsValue, dutyRate, excise, taxRate, includeDutyInTax } = request;
  const compute = (): Output => {
    H.domain(customsValue >= 0 && dutyRate >= 0 && excise >= 0 && taxRate >= 0);
    return {
      duty: customsValue * dutyRate,
      taxBase:
        customsValue +
        excise +
        (includeDutyInTax ? customsValue * dutyRate : 0),
      tax:
        (customsValue +
          excise +
          (includeDutyInTax ? customsValue * dutyRate : 0)) *
        taxRate,
      landedTaxTotal:
        customsValue * dutyRate +
        excise +
        (customsValue +
          excise +
          (includeDutyInTax ? customsValue * dutyRate : 0)) *
          taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    customsValue: 1000,
    dutyRate: 0.1,
    excise: 50,
    taxRate: 0.2,
    includeDutyInTax: true,
  },
  output: { duty: 100, taxBase: 1150, tax: 230, landedTaxTotal: 380 },
} satisfies ToolExample<Input, Output>;
export const customsDutyTaxSequenceOneLineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/customs-duty-tax-sequence-one-line",
    title: "Customs Duty Tax Sequence One Line Tool",
    description:
      "Explicit supplied customs duty and tax-base sequence, without jurisdictional tariff or tax-rule lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        customsValue: { type: "number", minimum: 0 },
        dutyRate: { type: "number", minimum: 0 },
        excise: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        includeDutyInTax: { type: "boolean" },
      },
      required: [
        "customsValue",
        "dutyRate",
        "excise",
        "taxRate",
        "includeDutyInTax",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duty: { type: "number" },
        taxBase: { type: "number" },
        tax: { type: "number" },
        landedTaxTotal: { type: "number" },
      },
      required: ["duty", "taxBase", "tax", "landedTaxTotal"],
    },
    ports: {
      inputs: [
        {
          id: "customsValue",
          label: "Customs Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dutyRate",
          label: "Duty Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excise",
          label: "Excise",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeDutyInTax",
          label: "Include Duty In Tax",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "duty", label: "Duty", valueType: { type: "number" } },
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        {
          id: "landedTaxTotal",
          label: "Landed Tax Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = customsDutyTaxSequenceOneLineTool.execute;
export default customsDutyTaxSequenceOneLineTool;
