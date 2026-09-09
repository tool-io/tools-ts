import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch47-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "A three-minute all-out critical-power test estimates parameters under specific assumptions about effort, pacing and work-capacity depletion.",
        reference: "Critical-power three-minute test research.",
        limitations:
          "Not automatic valid CP/Wprime from any three-minute ride or a safe maximal-test prescription.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "A three-minute all-out critical-power test estimates parameters under specific assumptions about effort, pacing and work-capacity depletion.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/critical-power-w-prime-three-minute-test-protocol",
  title: "Critical Power W\u2032 3-Minute Test Protocol",
  description:
    "Bounded offline reference: A three-minute all-out critical-power test estimates parameters under specific assumptions about effort, pacing and work-capacity depletion. Source: Critical-power three-minute test research. Not automatic valid CP/Wprime from any three-minute ride or a safe maximal-test prescription. Explicit topic keys: summary, reference, limitations. Not a full/current corpus, diagnosis, treatment recommendation or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
