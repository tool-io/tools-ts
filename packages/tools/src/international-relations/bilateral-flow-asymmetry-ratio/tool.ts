import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outboundFlow: number;
  readonly inboundFlow: number;
};
export type Output = { readonly signedAsymmetry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outboundFlow: { type: "number", minimum: 0 },
    inboundFlow: { type: "number", minimum: 0 },
  },
  required: ["outboundFlow", "inboundFlow"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedAsymmetry: { type: "number" } },
  required: ["signedAsymmetry"],
} as const;
/** Describe bilateral nonnegative flow asymmetry as (outbound-inbound)/(outbound+inbound) under a positive total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outboundFlow, inboundFlow } = request;
  const compute = (): Output => {
    H.domain(
      outboundFlow >= 0 && inboundFlow >= 0 && outboundFlow + inboundFlow > 0,
      "outboundFlow",
    );
    H.finite(outboundFlow + inboundFlow);
    return {
      signedAsymmetry:
        (outboundFlow - inboundFlow) / (outboundFlow + inboundFlow),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outboundFlow: 80, inboundFlow: 20 },
  output: { signedAsymmetry: 0.6 },
} satisfies ToolExample<Input, Output>;
export const bilateralFlowAsymmetryRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/bilateral-flow-asymmetry-ratio",
    title: "Bilateral Flow Asymmetry Ratio Tool",
    description:
      "Describe bilateral nonnegative flow asymmetry as (outbound-inbound)/(outbound+inbound) under a positive total.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outboundFlow: { type: "number", minimum: 0 },
        inboundFlow: { type: "number", minimum: 0 },
      },
      required: ["outboundFlow", "inboundFlow"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedAsymmetry: { type: "number" } },
      required: ["signedAsymmetry"],
    },
    ports: {
      inputs: [
        {
          id: "outboundFlow",
          label: "Outbound Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inboundFlow",
          label: "Inbound Flow",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedAsymmetry",
          label: "Signed Asymmetry",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bilateralFlowAsymmetryRatioTool.execute;
export default bilateralFlowAsymmetryRatioTool;
