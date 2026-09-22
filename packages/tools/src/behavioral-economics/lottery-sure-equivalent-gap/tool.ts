import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sureEquivalent: number;
  readonly lotteryPayoffs: readonly number[];
  readonly probabilities: readonly number[];
};
export type Output = { readonly expectedPayoff: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sureEquivalent: { type: "number" },
    lotteryPayoffs: { type: "array", maxItems: 256, items: { type: "number" } },
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["sureEquivalent", "lotteryPayoffs", "probabilities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedPayoff: { type: "number" }, gap: { type: "number" } },
  required: ["expectedPayoff", "gap"],
} as const;
/** Compare an explicitly elicited sure equivalent with expected payoff; no risk preference is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sureEquivalent, lotteryPayoffs, probabilities } = request;
  const compute = (): Output => {
    H.domain(
      probabilities.every((x) => x >= 0 && x <= 1) &&
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return {
      expectedPayoff: H.dot(lotteryPayoffs, probabilities),
      gap: sureEquivalent - H.dot(lotteryPayoffs, probabilities),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sureEquivalent: 4,
    lotteryPayoffs: [0, 10],
    probabilities: [0.5, 0.5],
  },
  output: { expectedPayoff: 5, gap: -1 },
} satisfies ToolExample<Input, Output>;
export const lotterySureEquivalentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/lottery-sure-equivalent-gap",
    title: "Lottery Sure Equivalent Gap Tool",
    description:
      "Compare an explicitly elicited sure equivalent with expected payoff; no risk preference is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sureEquivalent: { type: "number" },
        lotteryPayoffs: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["sureEquivalent", "lotteryPayoffs", "probabilities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedPayoff: { type: "number" },
        gap: { type: "number" },
      },
      required: ["expectedPayoff", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "sureEquivalent",
          label: "Sure Equivalent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lotteryPayoffs",
          label: "Lottery Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "expectedPayoff",
          label: "Expected Payoff",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lotterySureEquivalentGapTool.execute;
export default lotterySureEquivalentGapTool;
