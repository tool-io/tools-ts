import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceAdjustedPrice: number;
  readonly observedPrice: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceAdjustedPrice: { type: "number" },
    observedPrice: { type: "number" },
  },
  required: ["referenceAdjustedPrice", "observedPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied observed-minus-corporate-action-adjusted reference price without computing an adjustment factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceAdjustedPrice, observedPrice } = request;
  const compute = (): Output => {
    return { signedGap: observedPrice - referenceAdjustedPrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceAdjustedPrice: 12, observedPrice: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const corporateActionReferencePriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/corporate-action-reference-price-gap",
    title: "Corporate Action Reference Price Gap Tool",
    description:
      "Calculate supplied observed-minus-corporate-action-adjusted reference price without computing an adjustment factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceAdjustedPrice: { type: "number" },
        observedPrice: { type: "number" },
      },
      required: ["referenceAdjustedPrice", "observedPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceAdjustedPrice",
          label: "Reference Adjusted Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedPrice",
          label: "Observed Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = corporateActionReferencePriceGapTool.execute;
export default corporateActionReferencePriceGapTool;
