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
          "Pyrrhonian suspension of judgment, epoch\u0113, is distinguished from tranquility, ataraxia, which Sextus discusses as following in some contexts.",
        reference: "Sextus Empiricus, Outlines of Pyrrhonism 1.",
        limitations:
          "Not universal indecision, guaranteed calm or a clinical treatment.",
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
      text: "Pyrrhonian suspension of judgment, epoch\u0113, is distinguished from tranquility, ataraxia, which Sextus discusses as following in some contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pyrrhonian-skepticism-epoche-ataraxia-distinction-lookup",
  title: "Pyrrhonian Skepticism Epoche Ataraxia Distinction Lookup",
  description:
    "Bounded offline reference: Pyrrhonian suspension of judgment, epoch\u0113, is distinguished from tranquility, ataraxia, which Sextus discusses as following in some contexts. Source: Sextus Empiricus, Outlines of Pyrrhonism 1. Not universal indecision, guaranteed calm or a clinical treatment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
