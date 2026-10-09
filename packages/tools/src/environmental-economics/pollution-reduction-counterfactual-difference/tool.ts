import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counterfactualPollution: number;
  readonly observedPollution: number;
};
export type Output = { readonly signedReduction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counterfactualPollution: { type: "number", minimum: 0 },
    observedPollution: { type: "number", minimum: 0 },
  },
  required: ["counterfactualPollution", "observedPollution"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedReduction: { type: "number" } },
  required: ["signedReduction"],
} as const;
/** Subtract supplied observed pollution from an explicit counterfactual level without estimating causal policy impact. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counterfactualPollution, observedPollution } = request;
  const compute = (): Output => {
    H.domain(counterfactualPollution >= 0, "counterfactualPollution");
    H.domain(observedPollution >= 0, "observedPollution");
    return { signedReduction: counterfactualPollution - observedPollution };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { counterfactualPollution: 100, observedPollution: 80 },
  output: { signedReduction: 20 },
} satisfies ToolExample<Input, Output>;
export const pollutionReductionCounterfactualDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/pollution-reduction-counterfactual-difference",
      title: "Pollution Reduction Counterfactual Difference Tool",
      description:
        "Subtract supplied observed pollution from an explicit counterfactual level without estimating causal policy impact.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counterfactualPollution: { type: "number", minimum: 0 },
          observedPollution: { type: "number", minimum: 0 },
        },
        required: ["counterfactualPollution", "observedPollution"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { signedReduction: { type: "number" } },
        required: ["signedReduction"],
      },
      ports: {
        inputs: [
          {
            id: "counterfactualPollution",
            label: "Counterfactual Pollution",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedPollution",
            label: "Observed Pollution",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedReduction",
            label: "Signed Reduction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pollutionReductionCounterfactualDifferenceTool.execute;
export default pollutionReductionCounterfactualDifferenceTool;
