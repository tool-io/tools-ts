import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pretaxRate: number;
  readonly taxFraction: number;
  readonly fixedTaxPerUnit: number;
};
export type Output = { readonly taxWedge: number; readonly taxedRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pretaxRate: { type: "number" },
    taxFraction: { type: "number", minimum: 0 },
    fixedTaxPerUnit: { type: "number" },
  },
  required: ["pretaxRate", "taxFraction", "fixedTaxPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxWedge: { type: "number" }, taxedRate: { type: "number" } },
  required: ["taxWedge", "taxedRate"],
} as const;
/** Apply explicit tariff tax components without selecting current rates or jurisdictional rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pretaxRate, taxFraction, fixedTaxPerUnit } = request;
  const compute = (): Output => {
    H.domain(taxFraction >= 0);
    return {
      taxWedge: pretaxRate * taxFraction + fixedTaxPerUnit,
      taxedRate: pretaxRate * (1 + taxFraction) + fixedTaxPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pretaxRate: 10, taxFraction: 0.2, fixedTaxPerUnit: 1 },
  output: { taxWedge: 3, taxedRate: 13 },
} satisfies ToolExample<Input, Output>;
export const energyTariffTaxWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/energy-tariff-tax-wedge",
    title: "Energy Tariff Tax Wedge Tool",
    description:
      "Apply explicit tariff tax components without selecting current rates or jurisdictional rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pretaxRate: { type: "number" },
        taxFraction: { type: "number", minimum: 0 },
        fixedTaxPerUnit: { type: "number" },
      },
      required: ["pretaxRate", "taxFraction", "fixedTaxPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxWedge: { type: "number" },
        taxedRate: { type: "number" },
      },
      required: ["taxWedge", "taxedRate"],
    },
    ports: {
      inputs: [
        {
          id: "pretaxRate",
          label: "Pretax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxFraction",
          label: "Tax Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedTaxPerUnit",
          label: "Fixed Tax Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "taxWedge", label: "Tax Wedge", valueType: { type: "number" } },
        { id: "taxedRate", label: "Taxed Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = energyTariffTaxWedgeTool.execute;
export default energyTariffTaxWedgeTool;
