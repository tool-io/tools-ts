import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  sourceFor,
  indices,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  return {
    mainNumbers: indices(
      50,
      { seed: input.seed, count: 5, withoutReplacement: true },
      random,
    ).map((v) => v + 1),
    luckyStars: indices(
      12,
      { seed: input.seed, count: 2, withoutReplacement: true },
      random,
    ).map((v) => v + 1),
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
      mainNumbers: [21, 18, 29, 13, 19],
      luckyStars: [2, 5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/euromillions-quick-pick",
  title: "Lottery Quick Pick EuroMillions",
  description:
    "Declared current50main/12starrangesEuroMillions-stylequickpick,twoindependentsetswithONEadvancingsource;not officialbet/validation/livegamepolicy. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
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
