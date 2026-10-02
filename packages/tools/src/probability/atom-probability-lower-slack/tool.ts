import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly suppliedLowerBound: number;
};
export type Output = { readonly slack: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    suppliedLowerBound: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["probability", "suppliedLowerBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "number" }, feasible: { type: "boolean" } },
  required: ["slack", "feasible"],
} as const;
/** Calculate atom probability lower slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, suppliedLowerBound } = request;
  const compute = (): Output => {
    H.probability(probability);
    H.probability(suppliedLowerBound);
    return {
      slack: probability - suppliedLowerBound,
      feasible: probability >= suppliedLowerBound,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.3, suppliedLowerBound: 0.2 },
  output: { slack: 0.09999999999999998, feasible: true },
} satisfies ToolExample<Input, Output>;
export const atomProbabilityLowerSlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/atom-probability-lower-slack",
    title: "Atom Probability Lower Slack Tool",
    description:
      "Calculate atom probability lower slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        suppliedLowerBound: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["probability", "suppliedLowerBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slack: { type: "number" }, feasible: { type: "boolean" } },
      required: ["slack", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLowerBound",
          label: "Supplied Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = atomProbabilityLowerSlackTool.execute;
export default atomProbabilityLowerSlackTool;
