import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly baseline: number;
  readonly weight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    baseline: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["score", "baseline", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate ethics matrix one criterion weighted term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, baseline, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return { contribution: (score - baseline) * weight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 4, baseline: 2, weight: 0.25 },
  output: { contribution: 0.5 },
} satisfies ToolExample<Input, Output>;
export const ethicsMatrixOneCriterionWeightedTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/ethics-matrix-one-criterion-weighted-term",
      title: "Ethics Matrix One Criterion Weighted Term Tool",
      description:
        "Calculate ethics matrix one criterion weighted term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          score: { type: "number" },
          baseline: { type: "number" },
          weight: { type: "number", minimum: 0 },
        },
        required: ["score", "baseline", "weight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { contribution: { type: "number" } },
        required: ["contribution"],
      },
      ports: {
        inputs: [
          {
            id: "score",
            label: "Score",
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
            id: "weight",
            label: "Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ethicsMatrixOneCriterionWeightedTermTool.execute;
export default ethicsMatrixOneCriterionWeightedTermTool;
