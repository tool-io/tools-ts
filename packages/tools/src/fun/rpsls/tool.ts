import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sourceFor, draw } from "../batch51-shared.js";
export type Input = Readonly<{ readonly seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context),
    choices = ["rock", "paper", "scissors", "lizard", "Spock"];
  return {
    unpredictableToUninformedOpponentChoice:
      choices[draw(0, choices.length - 1, random)],
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51" },
  output: {
    result: {
      unpredictableToUninformedOpponentChoice: "scissors",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/rpsls",
  title: "Rock Paper Scissors Lizard Spock Advisor",
  description:
    "UniformmixedstrategychoiceunderbalancedRPSrules,no inferenceopponentstrategyor guaranteedwin. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
