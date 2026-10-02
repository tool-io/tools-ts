import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successProbability: number;
  readonly additionalTrials: number;
};
export type Output = { readonly tailRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successProbability: { type: "number", minimum: 0, maximum: 1 },
    additionalTrials: { type: "integer", minimum: 0 },
  },
  required: ["successProbability", "additionalTrials"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tailRatio: { type: "number" } },
  required: ["tailRatio"],
} as const;
/** Return geometric survival-tail ratio (1-p)^k with the k=0 empty-product convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { successProbability, additionalTrials } = request;
  const compute = (): Output => {
    H.probability(successProbability);
    H.integer(additionalTrials, 0);
    return { tailRatio: (1 - successProbability) ** additionalTrials };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { successProbability: 0.5, additionalTrials: 3 },
  output: { tailRatio: 0.125 },
} satisfies ToolExample<Input, Output>;
export const geometricTailRatioTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "probability/geometric-tail-ratio",
    title: "Geometric Tail Ratio Tool",
    description:
      "Return geometric survival-tail ratio (1-p)^k with the k=0 empty-product convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        successProbability: { type: "number", minimum: 0, maximum: 1 },
        additionalTrials: { type: "integer", minimum: 0 },
      },
      required: ["successProbability", "additionalTrials"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tailRatio: { type: "number" } },
      required: ["tailRatio"],
    },
    ports: {
      inputs: [
        {
          id: "successProbability",
          label: "Success Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "additionalTrials",
          label: "Additional Trials",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "tailRatio", label: "Tail Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = geometricTailRatioTool.execute;
export default geometricTailRatioTool;
