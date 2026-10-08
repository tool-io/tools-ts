import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transcribedPrice: number;
  readonly suppliedCorrectionFactor: number;
};
export type Output = { readonly correctedPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transcribedPrice: { type: "number" },
    suppliedCorrectionFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["transcribedPrice", "suppliedCorrectionFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedPrice: { type: "number" } },
  required: ["correctedPrice"],
} as const;
/** Apply an explicitly supplied positive archival price correction factor without deriving historical conversion conventions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transcribedPrice, suppliedCorrectionFactor } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(suppliedCorrectionFactor) && suppliedCorrectionFactor > 0,
      "suppliedCorrectionFactor",
    ),
      suppliedCorrectionFactor);
    return { correctedPrice: transcribedPrice * suppliedCorrectionFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { transcribedPrice: 12, suppliedCorrectionFactor: 0.5 },
  output: { correctedPrice: 6 },
} satisfies ToolExample<Input, Output>;
export const oldPriceSourceCorrectionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/old-price-source-correction-factor",
    title: "Old Price Source Correction Factor Tool",
    description:
      "Apply an explicitly supplied positive archival price correction factor without deriving historical conversion conventions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transcribedPrice: { type: "number" },
        suppliedCorrectionFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["transcribedPrice", "suppliedCorrectionFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedPrice: { type: "number" } },
      required: ["correctedPrice"],
    },
    ports: {
      inputs: [
        {
          id: "transcribedPrice",
          label: "Transcribed Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCorrectionFactor",
          label: "Supplied Correction Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedPrice",
          label: "Corrected Price",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oldPriceSourceCorrectionFactorTool.execute;
export default oldPriceSourceCorrectionFactorTool;
