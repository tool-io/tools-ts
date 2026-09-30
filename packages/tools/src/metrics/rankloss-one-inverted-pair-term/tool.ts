import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positiveScore: number;
  readonly negativeScore: number;
  readonly tieCredit: number;
};
export type Output = { readonly loss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveScore: { type: "number" },
    negativeScore: { type: "number" },
    tieCredit: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["positiveScore", "negativeScore", "tieCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loss: { type: "number" } },
  required: ["loss"],
} as const;
/** Calculate rankloss one inverted pair term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { positiveScore, negativeScore, tieCredit } = input;
  const compute = (): Output => {
    H.probability(tieCredit);
    return {
      loss:
        positiveScore < negativeScore
          ? 1
          : positiveScore === negativeScore
            ? tieCredit
            : 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { positiveScore: 0.2, negativeScore: 0.8, tieCredit: 0.5 },
  output: { loss: 1 },
} satisfies ToolExample<Input, Output>;
export const ranklossOneInvertedPairTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/rankloss-one-inverted-pair-term",
    title: "Rankloss One Inverted Pair Term Tool",
    description:
      "Calculate rankloss one inverted pair term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveScore: { type: "number" },
        negativeScore: { type: "number" },
        tieCredit: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["positiveScore", "negativeScore", "tieCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { loss: { type: "number" } },
      required: ["loss"],
    },
    ports: {
      inputs: [
        {
          id: "positiveScore",
          label: "Positive Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "negativeScore",
          label: "Negative Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tieCredit",
          label: "Tie Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "loss", label: "Loss", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = ranklossOneInvertedPairTermTool.execute;
export default ranklossOneInvertedPairTermTool;
