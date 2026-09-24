import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly randomized: number;
  readonly treated: number;
  readonly assessed: number;
  readonly successes: number;
  readonly useRandomized: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly proportion: number;
  readonly unassessedTreated: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    randomized: { type: "integer", minimum: 1 },
    treated: { type: "integer", minimum: 1 },
    assessed: { type: "integer", minimum: 0 },
    successes: { type: "integer", minimum: 0 },
    useRandomized: { type: "boolean" },
  },
  required: ["randomized", "treated", "assessed", "successes", "useRandomized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    proportion: { type: "number" },
    unassessedTreated: { type: "integer" },
  },
  required: ["denominator", "proportion", "unassessedTreated"],
} as const;
/** Keep supplied analysis population denominators explicit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { randomized, treated, assessed, successes, useRandomized } = request;
  const compute = (): Output => {
    H.integer(randomized, 1);
    H.integer(treated, 1, randomized);
    H.integer(assessed, 0, treated);
    H.integer(successes, 0, assessed);
    return {
      denominator: useRandomized ? randomized : treated,
      proportion: successes / (useRandomized ? randomized : treated),
      unassessedTreated: treated - assessed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    randomized: 100,
    treated: 90,
    assessed: 80,
    successes: 40,
    useRandomized: true,
  },
  output: { denominator: 100, proportion: 0.4, unassessedTreated: 10 },
} satisfies ToolExample<Input, Output>;
export const trialRandomizedTreatedDenominatorChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-trials/trial-randomized-treated-denominator-choice",
      title: "Trial Randomized Treated Denominator Choice Tool",
      description: "Keep supplied analysis population denominators explicit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          randomized: { type: "integer", minimum: 1 },
          treated: { type: "integer", minimum: 1 },
          assessed: { type: "integer", minimum: 0 },
          successes: { type: "integer", minimum: 0 },
          useRandomized: { type: "boolean" },
        },
        required: [
          "randomized",
          "treated",
          "assessed",
          "successes",
          "useRandomized",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "integer" },
          proportion: { type: "number" },
          unassessedTreated: { type: "integer" },
        },
        required: ["denominator", "proportion", "unassessedTreated"],
      },
      ports: {
        inputs: [
          {
            id: "randomized",
            label: "Randomized",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "treated",
            label: "Treated",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessed",
            label: "Assessed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "successes",
            label: "Successes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "useRandomized",
            label: "Use Randomized",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "proportion",
            label: "Proportion",
            valueType: { type: "number" },
          },
          {
            id: "unassessedTreated",
            label: "Unassessed Treated",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = trialRandomizedTreatedDenominatorChoiceTool.execute;
export default trialRandomizedTreatedDenominatorChoiceTool;
