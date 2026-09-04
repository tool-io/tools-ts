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
          "Some fishing communities record avoidance of particular words, including pig, in boat or sea contexts.",
        reference: "British and Irish maritime folklore collections.",
        limitations:
          "No universal fishermen rule or causal protection from word avoidance.",
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
      text: "Some fishing communities record avoidance of particular words, including pig, in boat or sea contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/fishermen-pig-taboo-at-sea-word-avoidance-customs",
  title: "Fishermen Pig Taboo At Sea Word Avoidance Customs",
  description:
    "Bounded offline reference: Some fishing communities record avoidance of particular words, including pig, in boat or sea contexts. Source: British and Irish maritime folklore collections. No universal fishermen rule or causal protection from word avoidance. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
