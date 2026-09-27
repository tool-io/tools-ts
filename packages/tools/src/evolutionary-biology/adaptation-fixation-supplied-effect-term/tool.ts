import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly p: number;
  readonly effectiveDiploids: number;
  readonly selectionCoefficient: number;
};
export type Output = { readonly fixationProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: { type: "number", minimum: 0, maximum: 1 },
    effectiveDiploids: { type: "number", exclusiveMinimum: 0 },
    selectionCoefficient: { type: "number" },
  },
  required: ["p", "effectiveDiploids", "selectionCoefficient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fixationProbability: { type: "number" } },
  required: ["fixationProbability"],
} as const;
/** Diffusion approximation for a genic selected allele, u=(1-exp(-4Nes*p))/(1-exp(-4Nes)); dominance is not included. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { p, effectiveDiploids, selectionCoefficient } = request;
  const compute = (): Output => {
    H.probability(p);
    H.positive(effectiveDiploids);
    const x = 4 * effectiveDiploids * selectionCoefficient;
    H.finite(x);
    const fixationProbability =
      x === 0
        ? p
        : x > 0
          ? -Math.expm1(-x * p) / -Math.expm1(-x)
          : (Math.exp(x * (1 - p)) * -Math.expm1(x * p)) / -Math.expm1(x);
    return { fixationProbability };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { p: 0.1, effectiveDiploids: 100, selectionCoefficient: 0 },
  output: { fixationProbability: 0.1 },
} satisfies ToolExample<Input, Output>;
export const adaptationFixationSuppliedEffectTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "evolutionary-biology/adaptation-fixation-supplied-effect-term",
      title: "Adaptation Fixation Supplied Effect Term Tool",
      description:
        "Diffusion approximation for a genic selected allele, u=(1-exp(-4Nes*p))/(1-exp(-4Nes)); dominance is not included.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          p: { type: "number", minimum: 0, maximum: 1 },
          effectiveDiploids: { type: "number", exclusiveMinimum: 0 },
          selectionCoefficient: { type: "number" },
        },
        required: ["p", "effectiveDiploids", "selectionCoefficient"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { fixationProbability: { type: "number" } },
        required: ["fixationProbability"],
      },
      ports: {
        inputs: [
          {
            id: "p",
            label: "P",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effectiveDiploids",
            label: "Effective Diploids",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "selectionCoefficient",
            label: "Selection Coefficient",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fixationProbability",
            label: "Fixation Probability",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = adaptationFixationSuppliedEffectTermTool.execute;
export default adaptationFixationSuppliedEffectTermTool;
