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
          "Thucydides describes an Athenian epidemic in book 2; modern pathogen identifications remain contested.",
        reference: "Thucydides 2.47\u201354; paleopathology debate.",
        limitations:
          "Symptoms and disputed ancient-DNA sampling do not establish a definite modern diagnosis or treatment.",
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
      text: "Thucydides describes an Athenian epidemic in book 2; modern pathogen identifications remain contested.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/athenian-plague-thucydides-description-modern-identification-debate",
  title: "Athenian Plague Thucydides Description Modern Identification Debate",
  description:
    "Bounded offline reference: Thucydides describes an Athenian epidemic in book 2; modern pathogen identifications remain contested. Source: Thucydides 2.47\u201354; paleopathology debate. Symptoms and disputed ancient-DNA sampling do not establish a definite modern diagnosis or treatment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
