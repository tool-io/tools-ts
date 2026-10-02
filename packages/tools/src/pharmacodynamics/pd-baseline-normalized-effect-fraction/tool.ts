import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly baseline: number;
  readonly maximum: number;
};
export type Output = {
  readonly change: number;
  readonly fraction: number;
  readonly remainingFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    baseline: { type: "number" },
    maximum: { type: "number" },
  },
  required: ["observed", "baseline", "maximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    change: { type: "number" },
    fraction: { type: "number" },
    remainingFraction: { type: "number" },
  },
  required: ["change", "fraction", "remainingFraction"],
} as const;
/** Calculate pd baseline normalized effect fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, baseline, maximum } = request;
  const compute = (): Output => {
    H.domain(maximum !== baseline);
    return {
      change: observed - baseline,
      fraction: (observed - baseline) / (maximum - baseline),
      remainingFraction: (maximum - observed) / (maximum - baseline),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 6, baseline: 2, maximum: 10 },
  output: { change: 4, fraction: 0.5, remainingFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const pdBaselineNormalizedEffectFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-baseline-normalized-effect-fraction",
    title: "PD Baseline Normalized Effect Fraction Tool",
    description:
      "Calculate pd baseline normalized effect fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        baseline: { type: "number" },
        maximum: { type: "number" },
      },
      required: ["observed", "baseline", "maximum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        change: { type: "number" },
        fraction: { type: "number" },
        remainingFraction: { type: "number" },
      },
      required: ["change", "fraction", "remainingFraction"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
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
          id: "maximum",
          label: "Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "change", label: "Change", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "remainingFraction",
          label: "Remaining Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdBaselineNormalizedEffectFractionTool.execute;
export default pdBaselineNormalizedEffectFractionTool;
