import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trueClassProbability: number;
  readonly alpha: number;
  readonly gamma: number;
};
export type Output = { readonly loss: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trueClassProbability: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
    alpha: { type: "number", minimum: 0 },
    gamma: { type: "number", minimum: 0 },
  },
  required: ["trueClassProbability", "alpha", "gamma"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loss: { type: "number" } },
  required: ["loss"],
} as const;
/** Calculate focal loss one probability term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trueClassProbability, alpha, gamma } = request;
  const compute = (): Output => {
    H.probability(trueClassProbability);
    H.positive(trueClassProbability);
    H.domain(alpha >= 0 && gamma >= 0);
    return {
      loss:
        alpha === 0
          ? 0
          : -alpha *
            (1 - trueClassProbability) ** gamma *
            Math.log(trueClassProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trueClassProbability: 0.5, alpha: 0.25, gamma: 2 },
  output: { loss: 0.04332169878499658 },
} satisfies ToolExample<Input, Output>;
export const focalLossOneProbabilityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/focal-loss-one-probability-term",
    title: "Focal Loss One Probability Term Tool",
    description:
      "Calculate focal loss one probability term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trueClassProbability: {
          type: "number",
          exclusiveMinimum: 0,
          minimum: 0,
          maximum: 1,
        },
        alpha: { type: "number", minimum: 0 },
        gamma: { type: "number", minimum: 0 },
      },
      required: ["trueClassProbability", "alpha", "gamma"],
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
          id: "trueClassProbability",
          label: "True Class Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "alpha",
          label: "Alpha",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gamma",
          label: "Gamma",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "loss", label: "Loss", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = focalLossOneProbabilityTermTool.execute;
export default focalLossOneProbabilityTermTool;
