import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly pagesPerUnit: number;
  readonly pricePerUnit: number;
  readonly roundUp: boolean;
};
export type Output = { readonly units: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "number", minimum: 0 },
    pagesPerUnit: { type: "number", exclusiveMinimum: 0 },
    pricePerUnit: { type: "number", minimum: 0 },
    roundUp: { type: "boolean" },
  },
  required: ["pages", "pagesPerUnit", "pricePerUnit", "roundUp"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { units: { type: "number" }, charge: { type: "number" } },
  required: ["units", "charge"],
} as const;
/** Calculate document copy fraction charge budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pages, pagesPerUnit, pricePerUnit, roundUp } = request;
  const compute = (): Output => {
    H.domain(pages >= 0 && pricePerUnit >= 0);
    H.positive(pagesPerUnit);
    return {
      units: roundUp ? Math.ceil(pages / pagesPerUnit) : pages / pagesPerUnit,
      charge:
        (roundUp ? Math.ceil(pages / pagesPerUnit) : pages / pagesPerUnit) *
        pricePerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pages: 12, pagesPerUnit: 5, pricePerUnit: 2, roundUp: true },
  output: { units: 3, charge: 6 },
} satisfies ToolExample<Input, Output>;
export const documentCopyFractionChargeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/document-copy-fraction-charge-budget",
    title: "Document Copy Fraction Charge Budget Tool",
    description:
      "Calculate document copy fraction charge budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pages: { type: "number", minimum: 0 },
        pagesPerUnit: { type: "number", exclusiveMinimum: 0 },
        pricePerUnit: { type: "number", minimum: 0 },
        roundUp: { type: "boolean" },
      },
      required: ["pages", "pagesPerUnit", "pricePerUnit", "roundUp"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { units: { type: "number" }, charge: { type: "number" } },
      required: ["units", "charge"],
    },
    ports: {
      inputs: [
        {
          id: "pages",
          label: "Pages",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pagesPerUnit",
          label: "Pages Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerUnit",
          label: "Price Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundUp",
          label: "Round Up",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "units", label: "Units", valueType: { type: "number" } },
        { id: "charge", label: "Charge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = documentCopyFractionChargeBudgetTool.execute;
export default documentCopyFractionChargeBudgetTool;
