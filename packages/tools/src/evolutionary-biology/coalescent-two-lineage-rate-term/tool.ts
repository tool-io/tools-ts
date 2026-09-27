import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effectiveDiploids: number;
  readonly elapsedGenerations: number;
};
export type Output = {
  readonly rate: number;
  readonly meanTime: number;
  readonly survival: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveDiploids: { type: "number", exclusiveMinimum: 0 },
    elapsedGenerations: { type: "number", minimum: 0 },
  },
  required: ["effectiveDiploids", "elapsedGenerations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rate: { type: "number" },
    meanTime: { type: "number" },
    survival: { type: "number" },
  },
  required: ["rate", "meanTime", "survival"],
} as const;
/** Continuous-time Kingman pair coalescent approximation in diploid generations, not the exact finite-N geometric survival. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effectiveDiploids, elapsedGenerations } = request;
  const compute = (): Output => {
    H.positive(effectiveDiploids);
    H.domain(elapsedGenerations >= 0);
    return {
      rate: 1 / (2 * effectiveDiploids),
      meanTime: 2 * effectiveDiploids,
      survival: Math.exp(-elapsedGenerations / (2 * effectiveDiploids)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { effectiveDiploids: 100, elapsedGenerations: 200 },
  output: { rate: 0.005, meanTime: 200, survival: 0.36787944117144233 },
} satisfies ToolExample<Input, Output>;
export const coalescentTwoLineageRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/coalescent-two-lineage-rate-term",
    title: "Coalescent Two Lineage Rate Term Tool",
    description:
      "Continuous-time Kingman pair coalescent approximation in diploid generations, not the exact finite-N geometric survival.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveDiploids: { type: "number", exclusiveMinimum: 0 },
        elapsedGenerations: { type: "number", minimum: 0 },
      },
      required: ["effectiveDiploids", "elapsedGenerations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rate: { type: "number" },
        meanTime: { type: "number" },
        survival: { type: "number" },
      },
      required: ["rate", "meanTime", "survival"],
    },
    ports: {
      inputs: [
        {
          id: "effectiveDiploids",
          label: "Effective Diploids",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedGenerations",
          label: "Elapsed Generations",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        { id: "meanTime", label: "Mean Time", valueType: { type: "number" } },
        { id: "survival", label: "Survival", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coalescentTwoLineageRateTermTool.execute;
export default coalescentTwoLineageRateTermTool;
