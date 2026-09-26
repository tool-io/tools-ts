import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly budget: number;
  readonly spent: number;
  readonly committed: number;
};
export type Output = { readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number", minimum: 0 },
    spent: { type: "number", minimum: 0 },
    committed: { type: "number", minimum: 0 },
  },
  required: ["budget", "spent", "committed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "number" } },
  required: ["remaining"],
} as const;
/** Calculate startup experiment loss budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, spent, committed } = request;
  const compute = (): Output => {
    H.domain(budget >= 0 && spent >= 0 && committed >= 0);
    return { remaining: budget - spent - committed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 1000, spent: 300, committed: 200 },
  output: { remaining: 500 },
} satisfies ToolExample<Input, Output>;
export const startupExperimentLossBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-experiment-loss-budget",
    title: "Startup Experiment Loss Budget Tool",
    description:
      "Calculate startup experiment loss budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number", minimum: 0 },
        spent: { type: "number", minimum: 0 },
        committed: { type: "number", minimum: 0 },
      },
      required: ["budget", "spent", "committed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remaining: { type: "number" } },
      required: ["remaining"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spent",
          label: "Spent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "committed",
          label: "Committed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = startupExperimentLossBudgetTool.execute;
export default startupExperimentLossBudgetTool;
