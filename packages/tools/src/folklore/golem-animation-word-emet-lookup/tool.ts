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
          "A familiar golem legend associates the Hebrew word emet, truth, with animation and removal of its first letter with met, dead.",
        reference: "Scholem, On the Kabbalah and Its Symbolism, golem chapter.",
        limitations:
          "Versions and dates differ; historical narrative only, not an effective animation ritual or exact universal origin.",
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
      text: "A familiar golem legend associates the Hebrew word emet, truth, with animation and removal of its first letter with met, dead.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/golem-animation-word-emet-lookup",
  title: "Golem Animation Word Emet Lookup",
  description:
    "Bounded offline reference: A familiar golem legend associates the Hebrew word emet, truth, with animation and removal of its first letter with met, dead. Source: Scholem, On the Kabbalah and Its Symbolism, golem chapter. Versions and dates differ; historical narrative only, not an effective animation ritual or exact universal origin. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
