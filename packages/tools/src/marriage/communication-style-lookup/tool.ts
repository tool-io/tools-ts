import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch48-shared.js";
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
          "Assertive, passive, aggressive and passive-aggressive are common descriptive communication labels, not universal personality diagnoses.",
        reference: "Communication-skills descriptive frameworks.",
        limitations:
          "Offline bounded framework note, no partner diagnosis, exclusive category, validated instrument or evidence that matching labels guarantees satisfaction.",
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
      text: "Assertive, passive, aggressive and passive-aggressive are common descriptive communication labels, not universal personality diagnoses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/communication-style-lookup",
  title: "Communication Style Lookup",
  description:
    "Bounded offline reference: Assertive, passive, aggressive and passive-aggressive are common descriptive communication labels, not universal personality diagnoses. Source: Communication-skills descriptive frameworks. Offline bounded framework note, no partner diagnosis, exclusive category, validated instrument or evidence that matching labels guarantees satisfaction. Topic keys: summary, reference, limitations. Not a complete/current reference corpus, individual outcome, legal/design compliance or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
