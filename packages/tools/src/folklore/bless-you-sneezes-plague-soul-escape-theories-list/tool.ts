import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch44-shared.js";

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
        summary:
          "Bless-you sneeze explanations include religious, soul and plague stories, with uncertain lineages.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No single securely proven origin, medical protection or diagnosis.",
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
      text: "Bless-you sneeze explanations include religious, soul and plague stories, with uncertain lineages.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/bless-you-sneezes-plague-soul-escape-theories-list",
  title: "Bless You Sneezes Plague Soul Escape Theories List",
  description:
    "Bounded offline reference: Bless-you sneeze explanations include religious, soul and plague stories, with uncertain lineages. Source: Simpson and Roud, A Dictionary of English Folklore. No single securely proven origin, medical protection or diagnosis. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
