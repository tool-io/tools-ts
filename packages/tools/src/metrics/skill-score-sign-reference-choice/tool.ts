import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelLoss: number;
  readonly referenceLoss: number;
  readonly higherIsBetter: boolean;
};
export type Output = { readonly skill: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelLoss: { type: "number" },
    referenceLoss: { type: "number" },
    higherIsBetter: { type: "boolean" },
  },
  required: ["modelLoss", "referenceLoss", "higherIsBetter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { skill: { type: "number" } },
  required: ["skill"],
} as const;
/** Calculate skill score sign reference choice from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { modelLoss, referenceLoss, higherIsBetter } = input;
  const compute = (): Output => {
    H.domain(referenceLoss !== 0);
    return {
      skill: higherIsBetter
        ? modelLoss / referenceLoss - 1
        : 1 - modelLoss / referenceLoss,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { modelLoss: 2, referenceLoss: 4, higherIsBetter: false },
  output: { skill: 0.5 },
} satisfies ToolExample<Input, Output>;
export const skillScoreSignReferenceChoiceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/skill-score-sign-reference-choice",
    title: "Skill Score Sign Reference Choice Tool",
    description:
      "Calculate skill score sign reference choice from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelLoss: { type: "number" },
        referenceLoss: { type: "number" },
        higherIsBetter: { type: "boolean" },
      },
      required: ["modelLoss", "referenceLoss", "higherIsBetter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { skill: { type: "number" } },
      required: ["skill"],
    },
    ports: {
      inputs: [
        {
          id: "modelLoss",
          label: "Model Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceLoss",
          label: "Reference Loss",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherIsBetter",
          label: "Higher Is Better",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "skill", label: "Skill", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = skillScoreSignReferenceChoiceTool.execute;
export default skillScoreSignReferenceChoiceTool;
