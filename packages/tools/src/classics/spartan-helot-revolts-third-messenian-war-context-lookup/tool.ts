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
          "A major helot revolt followed the traditionally dated 464 BCE earthquake and involved resistance at Ithome and eventual displacement.",
        reference: "Thucydides 1.101\u2013103.",
        limitations:
          "Exact chronology, participants and the term Third Messenian War depend on historical reconstruction.",
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
      text: "A major helot revolt followed the traditionally dated 464 BCE earthquake and involved resistance at Ithome and eventual displacement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/spartan-helot-revolts-third-messenian-war-context-lookup",
  title: "Spartan Helot Revolts Third Messenian War Context Lookup",
  description:
    "Bounded offline reference: A major helot revolt followed the traditionally dated 464 BCE earthquake and involved resistance at Ithome and eventual displacement. Source: Thucydides 1.101\u2013103. Exact chronology, participants and the term Third Messenian War depend on historical reconstruction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
