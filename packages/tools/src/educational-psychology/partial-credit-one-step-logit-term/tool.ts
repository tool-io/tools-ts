import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ability: number;
  readonly stepDifficulty: number;
  readonly discrimination: number;
};
export type Output = {
  readonly adjacentLogOdds: number;
  readonly odds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ability: { type: "number" },
    stepDifficulty: { type: "number" },
    discrimination: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["ability", "stepDifficulty", "discrimination"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { adjacentLogOdds: { type: "number" }, odds: { type: "number" } },
  required: ["adjacentLogOdds", "odds"],
} as const;
/** Adjacent-category generalized partial-credit odds for one supplied step, not a category probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ability, stepDifficulty, discrimination } = request;
  const compute = (): Output => {
    H.positive(discrimination);
    return {
      adjacentLogOdds: discrimination * (ability - stepDifficulty),
      odds: Math.exp(discrimination * (ability - stepDifficulty)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ability: 2, stepDifficulty: 1, discrimination: 1 },
  output: { adjacentLogOdds: 1, odds: 2.718281828459045 },
} satisfies ToolExample<Input, Output>;
export const partialCreditOneStepLogitTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/partial-credit-one-step-logit-term",
    title: "Partial Credit One Step Logit Term Tool",
    description:
      "Adjacent-category generalized partial-credit odds for one supplied step, not a category probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ability: { type: "number" },
        stepDifficulty: { type: "number" },
        discrimination: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["ability", "stepDifficulty", "discrimination"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjacentLogOdds: { type: "number" },
        odds: { type: "number" },
      },
      required: ["adjacentLogOdds", "odds"],
    },
    ports: {
      inputs: [
        {
          id: "ability",
          label: "Ability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stepDifficulty",
          label: "Step Difficulty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discrimination",
          label: "Discrimination",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjacentLogOdds",
          label: "Adjacent Log Odds",
          valueType: { type: "number" },
        },
        { id: "odds", label: "Odds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = partialCreditOneStepLogitTermTool.execute;
export default partialCreditOneStepLogitTermTool;
