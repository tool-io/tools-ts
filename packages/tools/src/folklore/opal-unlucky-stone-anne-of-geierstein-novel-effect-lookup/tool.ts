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
          "Walter Scott's Anne of Geierstein 1839 is often invoked in discussions of later opal bad-luck stories.",
        reference: "Scott, Anne of Geierstein; gemstone folklore scholarship.",
        limitations:
          "Association does not prove the novel alone created every opal taboo or authenticates a stone.",
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
      text: "Walter Scott's Anne of Geierstein 1839 is often invoked in discussions of later opal bad-luck stories.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/opal-unlucky-stone-anne-of-geierstein-novel-effect-lookup",
  title: "Opal Unlucky Stone Anne of Geierstein Novel Effect Lookup",
  description:
    "Bounded offline reference: Walter Scott's Anne of Geierstein 1839 is often invoked in discussions of later opal bad-luck stories. Source: Scott, Anne of Geierstein; gemstone folklore scholarship. Association does not prove the novel alone created every opal taboo or authenticates a stone. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
