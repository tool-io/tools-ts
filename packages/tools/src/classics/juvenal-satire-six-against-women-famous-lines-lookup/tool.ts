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
          "Juvenals sixth satire uses a satiric voice and misogynistic caricature rather than a neutral survey of women.",
        reference: "Juvenal, Satire 6.",
        limitations:
          "Description does not endorse stereotypes or treat the persona as direct demographic evidence.",
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
      text: "Juvenals sixth satire uses a satiric voice and misogynistic caricature rather than a neutral survey of women.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/juvenal-satire-six-against-women-famous-lines-lookup",
  title: "Juvenal Satire Six Against Women Famous Lines Lookup",
  description:
    "Bounded offline reference: Juvenals sixth satire uses a satiric voice and misogynistic caricature rather than a neutral survey of women. Source: Juvenal, Satire 6. Description does not endorse stereotypes or treat the persona as direct demographic evidence. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
