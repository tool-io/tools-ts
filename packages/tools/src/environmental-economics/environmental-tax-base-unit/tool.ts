import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taxableQuantity: number;
  readonly unitsPerTaxUnit: number;
  readonly suppliedRate: number;
};
export type Output = { readonly taxUnits: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxableQuantity: { type: "number", minimum: 0 },
    unitsPerTaxUnit: { type: "number", exclusiveMinimum: 0 },
    suppliedRate: { type: "number" },
  },
  required: ["taxableQuantity", "unitsPerTaxUnit", "suppliedRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxUnits: { type: "number" }, charge: { type: "number" } },
  required: ["taxUnits", "charge"],
} as const;
/** Apply an explicitly supplied environmental tax rate to a stated quantity basis without selecting legal rates or exemptions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taxableQuantity, unitsPerTaxUnit, suppliedRate } = request;
  const compute = (): Output => {
    H.domain(taxableQuantity >= 0, "taxableQuantity");
    (H.domain(unitsPerTaxUnit > 0, "unitsPerTaxUnit"), unitsPerTaxUnit);
    return {
      taxUnits: taxableQuantity / unitsPerTaxUnit,
      charge: (taxableQuantity / unitsPerTaxUnit) * suppliedRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taxableQuantity: 2500, unitsPerTaxUnit: 1000, suppliedRate: 8 },
  output: { taxUnits: 2.5, charge: 20 },
} satisfies ToolExample<Input, Output>;
export const environmentalTaxBaseUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/environmental-tax-base-unit",
    title: "Environmental Tax Base Unit",
    description:
      "Apply an explicitly supplied environmental tax rate to a stated quantity basis without selecting legal rates or exemptions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxableQuantity: { type: "number", minimum: 0 },
        unitsPerTaxUnit: { type: "number", exclusiveMinimum: 0 },
        suppliedRate: { type: "number" },
      },
      required: ["taxableQuantity", "unitsPerTaxUnit", "suppliedRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { taxUnits: { type: "number" }, charge: { type: "number" } },
      required: ["taxUnits", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "taxableQuantity",
          label: "Taxable Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsPerTaxUnit",
          label: "Units Per Tax Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRate",
          label: "Supplied Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "taxUnits", label: "Tax Units", valueType: { type: "number" } },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = environmentalTaxBaseUnitTool.execute;
export default environmentalTaxBaseUnitTool;
