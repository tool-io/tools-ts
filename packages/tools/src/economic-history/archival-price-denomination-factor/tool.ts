import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPrice: number;
  readonly referenceUnitsPerRecordedUnit: number;
};
export type Output = { readonly referencePrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPrice: { type: "number" },
    referenceUnitsPerRecordedUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["recordedPrice", "referenceUnitsPerRecordedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { referencePrice: { type: "number" } },
  required: ["referencePrice"],
} as const;
/** Apply an explicitly sourced archival price-denomination factor without inventing a historical exchange rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedPrice, referenceUnitsPerRecordedUnit } = request;
  const compute = (): Output => {
    (H.domain(
      referenceUnitsPerRecordedUnit > 0,
      "referenceUnitsPerRecordedUnit",
    ),
      referenceUnitsPerRecordedUnit);
    return { referencePrice: recordedPrice * referenceUnitsPerRecordedUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedPrice: 12, referenceUnitsPerRecordedUnit: 0.5 },
  output: { referencePrice: 6 },
} satisfies ToolExample<Input, Output>;
export const archivalPriceDenominationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/archival-price-denomination-factor",
    title: "Archival Price Denomination Factor",
    description:
      "Apply an explicitly sourced archival price-denomination factor without inventing a historical exchange rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedPrice: { type: "number" },
        referenceUnitsPerRecordedUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["recordedPrice", "referenceUnitsPerRecordedUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { referencePrice: { type: "number" } },
      required: ["referencePrice"],
    },
    ports: {
      inputs: [
        {
          id: "recordedPrice",
          label: "Recorded Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceUnitsPerRecordedUnit",
          label: "Reference Units Per Recorded Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "referencePrice",
          label: "Reference Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalPriceDenominationFactorTool.execute;
export default archivalPriceDenominationFactorTool;
