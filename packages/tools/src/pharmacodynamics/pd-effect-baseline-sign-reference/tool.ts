import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effect: number;
  readonly baseline: number;
  readonly reductionIsPositive: boolean;
};
export type Output = { readonly signedChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effect: { type: "number" },
    baseline: { type: "number" },
    reductionIsPositive: { type: "boolean" },
  },
  required: ["effect", "baseline", "reductionIsPositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedChange: { type: "number" } },
  required: ["signedChange"],
} as const;
/** Orient supplied research effect changes under an explicit sign convention without efficacy interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effect, baseline, reductionIsPositive } = request;
  const compute = (): Output => {
    return {
      signedChange: (effect - baseline) * (reductionIsPositive ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effect: 6, baseline: 10, reductionIsPositive: true },
  output: { signedChange: 4 },
} satisfies ToolExample<Input, Output>;
export const pdEffectBaselineSignReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-effect-baseline-sign-reference",
    title: "PD Effect Baseline Sign Reference Tool",
    description:
      "Orient supplied research effect changes under an explicit sign convention without efficacy interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effect: { type: "number" },
        baseline: { type: "number" },
        reductionIsPositive: { type: "boolean" },
      },
      required: ["effect", "baseline", "reductionIsPositive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedChange: { type: "number" } },
      required: ["signedChange"],
    },
    ports: {
      inputs: [
        {
          id: "effect",
          label: "Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reductionIsPositive",
          label: "Reduction Is Positive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "signedChange",
          label: "Signed Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdEffectBaselineSignReferenceTool.execute;
export default pdEffectBaselineSignReferenceTool;
