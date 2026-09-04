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
          "The Scottish play is a theatrical euphemism for Macbeth in traditions associated with a supposed curse.",
        reference: "Shakespeare, Macbeth; theatre folklore collections.",
        limitations:
          "No curse efficacy or universally followed backstage rule established.",
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
      text: "The Scottish play is a theatrical euphemism for Macbeth in traditions associated with a supposed curse.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/scottish-play-macbeth-curse-euphemism-origin-lookup",
  title: "Scottish Play Macbeth Curse Euphemism Origin Lookup",
  description:
    "Bounded offline reference: The Scottish play is a theatrical euphemism for Macbeth in traditions associated with a supposed curse. Source: Shakespeare, Macbeth; theatre folklore collections. No curse efficacy or universally followed backstage rule established. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
