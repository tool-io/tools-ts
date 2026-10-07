import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly payoffs: readonly number[];
};
export type Output = { readonly expectedPayoff: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["probabilities", "payoffs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedPayoff: { type: "number" } },
  required: ["expectedPayoff"],
} as const;
/** Compute a finite discrete lottery’s expected signed monetary payoff from an explicit complete probability distribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, payoffs } = request;
  const compute = (): Output => {
    H.domain(probabilities.length === payoffs.length, "payoffs");
    H.domain(probabilities.length > 0, "probabilities");
    probabilities.forEach(
      (v) => (H.domain(v >= 0 && v <= 1, "probabilities"), v),
    );
    H.domain(
      Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
      "probabilities",
    );
    return {
      expectedPayoff: probabilities.reduce((a, p, i) => a + p * payoffs[i], 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.25, 0.75], payoffs: [100, 0] },
  output: { expectedPayoff: 25 },
} satisfies ToolExample<Input, Output>;
export const lotteryExpectedPayoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/lottery-expected-payoff",
    title: "Lottery Expected Payoff",
    description:
      "Compute a finite discrete lottery’s expected signed monetary payoff from an explicit complete probability distribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        payoffs: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["probabilities", "payoffs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expectedPayoff: { type: "number" } },
      required: ["expectedPayoff"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "payoffs",
          label: "Payoffs",
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
      ],
    },
  },
  calculate,
});
export const run = lotteryExpectedPayoffTool.execute;
export default lotteryExpectedPayoffTool;
