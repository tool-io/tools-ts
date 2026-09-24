import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly scores: readonly number[];
  readonly targetIndex: number;
};
export type Output = {
  readonly tieCount: number;
  readonly targetProbability: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scores: { type: "array", maxItems: 256, items: { type: "number" } },
    targetIndex: { type: "integer", minimum: 0 },
  },
  required: ["scores", "targetIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tieCount: { type: "integer" },
    targetProbability: { type: "number" },
  },
  required: ["tieCount", "targetProbability"],
} as const;
/** Compute prediction tie random mass share from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { scores, targetIndex } = input;
  const compute = (): Output => {
    domain(scores.length > 0);
    integer(targetIndex, 0, scores.length - 1);
    const max = Math.max(...scores),
      tieCount = scores.filter((x) => x === max).length;
    return {
      tieCount,
      targetProbability: scores[targetIndex] === max ? 1 / tieCount : 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { scores: [1, 2, 2], targetIndex: 1 },
  output: { tieCount: 2, targetProbability: 0.5 },
} satisfies ToolExample<Input, Output>;
export const predictionTieRandomMassShareTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "classification/prediction-tie-random-mass-share",
  title: "Prediction Tie Random Mass Share Tool",
  description:
    "Compute prediction tie random mass share from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "scores",
        label: "Scores",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "targetIndex",
        label: "Target Index",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "tieCount", label: "Tie Count", valueType: { type: "integer" } },
      {
        id: "targetProbability",
        label: "Target Probability",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = predictionTieRandomMassShareTool.execute;
export default predictionTieRandomMassShareTool;
