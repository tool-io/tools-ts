import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowScore: number;
  readonly highScore: number;
  readonly weight: number;
};
export type Output = { readonly swing: number; readonly weightedSwing: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowScore: { type: "number" },
    highScore: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["lowScore", "highScore", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { swing: { type: "number" }, weightedSwing: { type: "number" } },
  required: ["swing", "weightedSwing"],
} as const;
/** Calculate decision weight swing one criterion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowScore, highScore, weight } = request;
  const compute = (): Output => {
    H.domain(highScore >= lowScore && weight >= 0);
    return {
      swing: highScore - lowScore,
      weightedSwing: (highScore - lowScore) * weight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowScore: 2, highScore: 8, weight: 0.25 },
  output: { swing: 6, weightedSwing: 1.5 },
} satisfies ToolExample<Input, Output>;
export const decisionWeightSwingOneCriterionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/decision-weight-swing-one-criterion",
    title: "Decision Weight Swing One Criterion Tool",
    description:
      "Calculate decision weight swing one criterion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowScore: { type: "number" },
        highScore: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["lowScore", "highScore", "weight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        swing: { type: "number" },
        weightedSwing: { type: "number" },
      },
      required: ["swing", "weightedSwing"],
    },
    ports: {
      inputs: [
        {
          id: "lowScore",
          label: "Low Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "highScore",
          label: "High Score",
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
        { id: "swing", label: "Swing", valueType: { type: "number" } },
        {
          id: "weightedSwing",
          label: "Weighted Swing",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = decisionWeightSwingOneCriterionTool.execute;
export default decisionWeightSwingOneCriterionTool;
