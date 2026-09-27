import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly p: number;
  readonly forwardRate: number;
  readonly backwardRate: number;
};
export type Output = { readonly nextP: number; readonly equilibriumP: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    p: { type: "number", minimum: 0, maximum: 1 },
    forwardRate: { type: "number", minimum: 0, maximum: 1 },
    backwardRate: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["p", "forwardRate", "backwardRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextP: { type: "number" }, equilibriumP: { type: "number" } },
  required: ["nextP", "equilibriumP"],
} as const;
/** Forward mutation removes the focal allele and backward mutation creates it; deterministic two-allele mutation only. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { p, forwardRate, backwardRate } = request;
  const compute = (): Output => {
    H.probability(p);
    H.probability(forwardRate);
    H.probability(backwardRate);
    H.domain(forwardRate + backwardRate > 0);
    return {
      nextP: p * (1 - forwardRate) + (1 - p) * backwardRate,
      equilibriumP: backwardRate / (forwardRate + backwardRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { p: 0.6, forwardRate: 0.01, backwardRate: 0.02 },
  output: { nextP: 0.602, equilibriumP: 0.6666666666666667 },
} satisfies ToolExample<Input, Output>;
export const mutationForwardBackwardBalanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/mutation-forward-backward-balance-term",
    title: "Mutation Forward Backward Balance Term Tool",
    description:
      "Forward mutation removes the focal allele and backward mutation creates it; deterministic two-allele mutation only.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        p: { type: "number", minimum: 0, maximum: 1 },
        forwardRate: { type: "number", minimum: 0, maximum: 1 },
        backwardRate: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["p", "forwardRate", "backwardRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nextP: { type: "number" },
        equilibriumP: { type: "number" },
      },
      required: ["nextP", "equilibriumP"],
    },
    ports: {
      inputs: [
        { id: "p", label: "P", required: true, valueType: { type: "number" } },
        {
          id: "forwardRate",
          label: "Forward Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "backwardRate",
          label: "Backward Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nextP", label: "Next P", valueType: { type: "number" } },
        {
          id: "equilibriumP",
          label: "Equilibrium P",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mutationForwardBackwardBalanceTermTool.execute;
export default mutationForwardBackwardBalanceTermTool;
