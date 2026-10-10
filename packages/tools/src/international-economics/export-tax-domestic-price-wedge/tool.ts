import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly worldPrice: number;
  readonly suppliedExportTaxPerUnit: number;
};
export type Output = {
  readonly domesticNetPrice: number;
  readonly priceWedge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    worldPrice: { type: "number" },
    suppliedExportTaxPerUnit: { type: "number", minimum: 0 },
  },
  required: ["worldPrice", "suppliedExportTaxPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    domesticNetPrice: { type: "number" },
    priceWedge: { type: "number" },
  },
  required: ["domesticNetPrice", "priceWedge"],
} as const;
/** Subtract an explicit per-unit export tax from supplied world price under a full-pass-through arithmetic convention without estimating equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { worldPrice, suppliedExportTaxPerUnit } = request;
  const compute = (): Output => {
    H.domain(suppliedExportTaxPerUnit >= 0, "suppliedExportTaxPerUnit");
    return {
      domesticNetPrice: worldPrice - suppliedExportTaxPerUnit,
      priceWedge: suppliedExportTaxPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { worldPrice: 100, suppliedExportTaxPerUnit: 10 },
  output: { domesticNetPrice: 90, priceWedge: 10 },
} satisfies ToolExample<Input, Output>;
export const exportTaxDomesticPriceWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/export-tax-domestic-price-wedge",
    title: "Export Tax Domestic Price Wedge Tool",
    description:
      "Subtract an explicit per-unit export tax from supplied world price under a full-pass-through arithmetic convention without estimating equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        worldPrice: { type: "number" },
        suppliedExportTaxPerUnit: { type: "number", minimum: 0 },
      },
      required: ["worldPrice", "suppliedExportTaxPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        domesticNetPrice: { type: "number" },
        priceWedge: { type: "number" },
      },
      required: ["domesticNetPrice", "priceWedge"],
    },
    ports: {
      inputs: [
        {
          id: "worldPrice",
          label: "World Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExportTaxPerUnit",
          label: "Supplied Export Tax Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "domesticNetPrice",
          label: "Domestic Net Price",
          valueType: { type: "number" },
        },
        {
          id: "priceWedge",
          label: "Price Wedge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exportTaxDomesticPriceWedgeTool.execute;
export default exportTaxDomesticPriceWedgeTool;
