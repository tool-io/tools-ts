import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly score: number;
  readonly reference: number;
  readonly higherMeansMatch: boolean;
};
export type Output = { readonly orientedMargin: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "number" },
    reference: { type: "number" },
    higherMeansMatch: { type: "boolean" },
  },
  required: ["score", "reference", "higherMeansMatch"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { orientedMargin: { type: "number" }, sign: { type: "integer" } },
  required: ["orientedMargin", "sign"],
} as const;
/** Orient an explicitly supplied deidentified research matcher score without identifying a person. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { score, reference, higherMeansMatch } = request;
  const compute = (): Output => {
    return {
      orientedMargin: (score - reference) * (higherMeansMatch ? 1 : -1),
      sign: Math.sign(score - reference) * (higherMeansMatch ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { score: 0.8, reference: 0.6, higherMeansMatch: true },
  output: { orientedMargin: 0.20000000000000007, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const matcherScoreDirectionSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/matcher-score-direction-sign",
    title: "Matcher Score Direction Sign Tool",
    description:
      "Orient an explicitly supplied deidentified research matcher score without identifying a person.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        score: { type: "number" },
        reference: { type: "number" },
        higherMeansMatch: { type: "boolean" },
      },
      required: ["score", "reference", "higherMeansMatch"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orientedMargin: { type: "number" },
        sign: { type: "integer" },
      },
      required: ["orientedMargin", "sign"],
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
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "higherMeansMatch",
          label: "Higher Means Match",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "orientedMargin",
          label: "Oriented Margin",
          valueType: { type: "number" },
        },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = matcherScoreDirectionSignTool.execute;
export default matcherScoreDirectionSignTool;
