import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        premise:
          "Post hoc power computed from the observed effect is not independent evidence for a study result and largely restates its test statistic. Prefer prospective independently justified effect assumptions and confidence intervals.",
        limitations:
          "A claimed power value requires design/variance/effect assumptions and a specified test; no universal power conclusion from d and n alone.",
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
  input: { topic: "premise" },
  output: {
    result: {
      text: "Post hoc power computed from the observed effect is not independent evidence for a study result and largely restates its test statistic. Prefer prospective independently justified effect assumptions and confidence intervals.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/post-hoc-power-from-d-and-n",
  title: "Post-Hoc Power From d and n Calculator",
  description:
    "Bounded off line reference: Observed power limitations, HoenigandHeisey2001; no fabricated exactt-power model. Explicit topics premise, limitations. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
