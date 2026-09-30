import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPrediction: number;
  readonly secondPrediction: number;
  readonly firstOutcome: number;
  readonly secondOutcome: number;
  readonly tieCredit: number;
};
export type Output = { readonly comparable: boolean; readonly credit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPrediction: { type: "number" },
    secondPrediction: { type: "number" },
    firstOutcome: { type: "number" },
    secondOutcome: { type: "number" },
    tieCredit: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "firstPrediction",
    "secondPrediction",
    "firstOutcome",
    "secondOutcome",
    "tieCredit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { comparable: { type: "boolean" }, credit: { type: "number" } },
  required: ["comparable", "credit"],
} as const;
/** Calculate concordance one tied pair credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstPrediction,
    secondPrediction,
    firstOutcome,
    secondOutcome,
    tieCredit,
  } = request;
  const compute = (): Output => {
    H.probability(tieCredit);
    const comparable = firstOutcome !== secondOutcome,
      product =
        (firstPrediction - secondPrediction) * (firstOutcome - secondOutcome);
    return {
      comparable,
      credit: !comparable ? 0 : product > 0 ? 1 : product < 0 ? 0 : tieCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPrediction: 2,
    secondPrediction: 2,
    firstOutcome: 1,
    secondOutcome: 3,
    tieCredit: 0.5,
  },
  output: { comparable: true, credit: 0.5 },
} satisfies ToolExample<Input, Output>;
export const concordanceOneTiedPairCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/concordance-one-tied-pair-credit",
    title: "Concordance One Tied Pair Credit Tool",
    description:
      "Calculate concordance one tied pair credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPrediction: { type: "number" },
        secondPrediction: { type: "number" },
        firstOutcome: { type: "number" },
        secondOutcome: { type: "number" },
        tieCredit: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "firstPrediction",
        "secondPrediction",
        "firstOutcome",
        "secondOutcome",
        "tieCredit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        credit: { type: "number" },
      },
      required: ["comparable", "credit"],
    },
    ports: {
      inputs: [
        {
          id: "firstPrediction",
          label: "First Prediction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondPrediction",
          label: "Second Prediction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstOutcome",
          label: "First Outcome",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondOutcome",
          label: "Second Outcome",
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
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        { id: "credit", label: "Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = concordanceOneTiedPairCreditTool.execute;
export default concordanceOneTiedPairCreditTool;
