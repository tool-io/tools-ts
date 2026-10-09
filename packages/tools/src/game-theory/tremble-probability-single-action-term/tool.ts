import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseActionProbability: number;
  readonly trembleFraction: number;
  readonly actionCount: number;
};
export type Output = { readonly perturbedActionProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseActionProbability: { type: "number", minimum: 0, maximum: 1 },
    trembleFraction: { type: "number", minimum: 0, maximum: 1 },
    actionCount: { type: "integer", minimum: 1 },
  },
  required: ["baseActionProbability", "trembleFraction", "actionCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { perturbedActionProbability: { type: "number" } },
  required: ["perturbedActionProbability"],
} as const;
/** Mix one explicit action probability with a uniform tremble across a supplied positive action count without validating a full strategy vector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseActionProbability, trembleFraction, actionCount } = request;
  const compute = (): Output => {
    (H.domain(
      baseActionProbability >= 0 && baseActionProbability <= 1,
      "baseActionProbability",
    ),
      baseActionProbability);
    (H.domain(trembleFraction >= 0 && trembleFraction <= 1, "trembleFraction"),
      trembleFraction);
    (H.domain(
      Number.isSafeInteger(actionCount) &&
        actionCount >= 1 &&
        actionCount <= Number.MAX_SAFE_INTEGER,
      "actionCount",
    ),
      actionCount);
    return {
      perturbedActionProbability:
        (1 - trembleFraction) * baseActionProbability +
        trembleFraction / actionCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseActionProbability: 1, trembleFraction: 0.2, actionCount: 4 },
  output: { perturbedActionProbability: 0.8500000000000001 },
} satisfies ToolExample<Input, Output>;
export const trembleProbabilitySingleActionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/tremble-probability-single-action-term",
    title: "Tremble Probability Single Action Term Tool",
    description:
      "Mix one explicit action probability with a uniform tremble across a supplied positive action count without validating a full strategy vector.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseActionProbability: { type: "number", minimum: 0, maximum: 1 },
        trembleFraction: { type: "number", minimum: 0, maximum: 1 },
        actionCount: { type: "integer", minimum: 1 },
      },
      required: ["baseActionProbability", "trembleFraction", "actionCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { perturbedActionProbability: { type: "number" } },
      required: ["perturbedActionProbability"],
    },
    ports: {
      inputs: [
        {
          id: "baseActionProbability",
          label: "Base Action Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trembleFraction",
          label: "Tremble Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actionCount",
          label: "Action Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "perturbedActionProbability",
          label: "Perturbed Action Probability",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trembleProbabilitySingleActionTermTool.execute;
export default trembleProbabilitySingleActionTermTool;
