import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Stipulatio involved a formal question-and-answer promise under changing Roman legal requirements; sponsiohas related specific historical uses.",
        reference: "Gaius, Institutes3; Justinian, Institutes 3.15.",
        limitations:
          "Language, capacity and periods matter; not a valid present-day contract template or timeless universal rule.",
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
      text: "Stipulatio involved a formal question-and-answer promise under changing Roman legal requirements; sponsiohas related specific historical uses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/stipulatio-sponsio-verbal-contract-question-answer-form",
  title: "Stipulatio Sponsio Verbal Contract Question Answer Form",
  description:
    "Bounded offline reference: Stipulatio involved a formal question-and-answer promise under changing Roman legal requirements; sponsiohas related specific historical uses. Source: Gaius, Institutes3; Justinian, Institutes 3.15. Language, capacity and periods matter; not a valid present-day contract template or timeless universal rule. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
