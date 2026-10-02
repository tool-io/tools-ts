import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly baseline: number;
  readonly suppliedScale: number;
};
export type Output = { readonly corrected: number; readonly negative: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number" },
    baseline: { type: "number" },
    suppliedScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["concentration", "baseline", "suppliedScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, negative: { type: "boolean" } },
  required: ["corrected", "negative"],
} as const;
/** Preserve signed baseline-corrected research observations without censoring negative values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, baseline, suppliedScale } = request;
  const compute = (): Output => {
    H.positive(suppliedScale);
    return {
      corrected: (concentration - baseline) * suppliedScale,
      negative: concentration < baseline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, baseline: 3, suppliedScale: 1 },
  output: { corrected: -1, negative: true },
} satisfies ToolExample<Input, Output>;
export const pkBaselineCorrectedNegativeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/pk-baseline-corrected-negative-flag",
    title: "PK Baseline Corrected Negative Flag Tool",
    description:
      "Preserve signed baseline-corrected research observations without censoring negative values.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number" },
        baseline: { type: "number" },
        suppliedScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["concentration", "baseline", "suppliedScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        negative: { type: "boolean" },
      },
      required: ["corrected", "negative"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
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
          id: "suppliedScale",
          label: "Supplied Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "negative", label: "Negative", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = pkBaselineCorrectedNegativeFlagTool.execute;
export default pkBaselineCorrectedNegativeFlagTool;
