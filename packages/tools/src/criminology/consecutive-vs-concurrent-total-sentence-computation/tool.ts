import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  sum,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyAuthorizedSentenceDurationsDays: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAuthorizedSentenceDurationsDays",
    label: "Independently authorized sentence durations days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.independentlyAuthorizedSentenceDurationsDays.length)
    simpleError("sentences", "Nonempty actual authorized durations.");
  input.independentlyAuthorizedSentenceDurationsDays.forEach((v) =>
    bounded(v, "days", 0, 1000000),
  );
  return {
    conditionalAllConcurrentDays: Math.max(
      ...input.independentlyAuthorizedSentenceDurationsDays,
    ),
    conditionalAllConsecutiveDays: sum(
      input.independentlyAuthorizedSentenceDurationsDays,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAuthorizedSentenceDurationsDays: [100, 200, 50] },
  output: {
    result: {
      conditionalAllConcurrentDays: 200,
      conditionalAllConsecutiveDays: 350,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "criminology/consecutive-vs-concurrent-total-sentence-computation",
  title: "Consecutive vs Concurrent Total Sentence Computation Tool",
  description:
    "Compare stipulated all-concurrent same-start versus all-consecutive duration scenarios. Mixed concurrency, start dates, credit, legal terms and release eligibility externally resolved; not actual judicial sentence computation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
