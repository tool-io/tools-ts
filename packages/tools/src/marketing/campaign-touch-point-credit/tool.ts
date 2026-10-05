import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conversionValue: number;
  readonly attributionFraction: number;
};
export type Output = { readonly attributedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conversionValue: { type: "number", minimum: 0 },
    attributionFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["conversionValue", "attributionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { attributedValue: { type: "number" } },
  required: ["attributedValue"],
} as const;
/** Allocate conversion value to one touch point using an explicitly supplied attribution fraction, without choosing an attribution model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conversionValue, attributionFraction } = request;
  const compute = (): Output => {
    H.domain(conversionValue >= 0, "conversionValue");
    (H.domain(
      attributionFraction >= 0 && attributionFraction <= 1,
      "attributionFraction",
    ),
      attributionFraction);
    return { attributedValue: conversionValue * attributionFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conversionValue: 120, attributionFraction: 0.25 },
  output: { attributedValue: 30 },
} satisfies ToolExample<Input, Output>;
export const campaignTouchPointCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/campaign-touch-point-credit",
    title: "Campaign Touch Point Credit Tool",
    description:
      "Allocate conversion value to one touch point using an explicitly supplied attribution fraction, without choosing an attribution model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conversionValue: { type: "number", minimum: 0 },
        attributionFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["conversionValue", "attributionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { attributedValue: { type: "number" } },
      required: ["attributedValue"],
    },
    ports: {
      inputs: [
        {
          id: "conversionValue",
          label: "Conversion Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "attributionFraction",
          label: "Attribution Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "attributedValue",
          label: "Attributed Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = campaignTouchPointCreditTool.execute;
export default campaignTouchPointCreditTool;
