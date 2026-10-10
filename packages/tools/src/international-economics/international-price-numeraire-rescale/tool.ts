import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly priceInOriginalUnits: number;
  readonly originalUnitsPerNumeraire: number;
};
export type Output = { readonly priceInNumeraire: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    priceInOriginalUnits: { type: "number" },
    originalUnitsPerNumeraire: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["priceInOriginalUnits", "originalUnitsPerNumeraire"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { priceInNumeraire: { type: "number" } },
  required: ["priceInNumeraire"],
} as const;
/** Rescale a supplied signed international price by an explicit positive original-units-per-numeraire quotation without selecting a price index. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { priceInOriginalUnits, originalUnitsPerNumeraire } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(originalUnitsPerNumeraire) &&
        originalUnitsPerNumeraire > 0,
      "originalUnitsPerNumeraire",
    ),
      originalUnitsPerNumeraire);
    return {
      priceInNumeraire: priceInOriginalUnits / originalUnitsPerNumeraire,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { priceInOriginalUnits: 120, originalUnitsPerNumeraire: 2 },
  output: { priceInNumeraire: 60 },
} satisfies ToolExample<Input, Output>;
export const internationalPriceNumeraireRescaleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/international-price-numeraire-rescale",
    title: "International Price Numeraire Rescale Tool",
    description:
      "Rescale a supplied signed international price by an explicit positive original-units-per-numeraire quotation without selecting a price index.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        priceInOriginalUnits: { type: "number" },
        originalUnitsPerNumeraire: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["priceInOriginalUnits", "originalUnitsPerNumeraire"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { priceInNumeraire: { type: "number" } },
      required: ["priceInNumeraire"],
    },
    ports: {
      inputs: [
        {
          id: "priceInOriginalUnits",
          label: "Price In Original Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originalUnitsPerNumeraire",
          label: "Original Units Per Numeraire",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "priceInNumeraire",
          label: "Price In Numeraire",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = internationalPriceNumeraireRescaleTool.execute;
export default internationalPriceNumeraireRescaleTool;
