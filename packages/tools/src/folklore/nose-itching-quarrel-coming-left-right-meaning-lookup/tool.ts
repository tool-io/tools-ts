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
          "Nose-itching/quarrel sayings assign meanings differently across local versions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Not a prediction of conflict or medical explanation of itching.",
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
      text: "Nose-itching/quarrel sayings assign meanings differently across local versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/nose-itching-quarrel-coming-left-right-meaning-lookup",
  title: "Nose Itching Quarrel Coming Left Right Meaning Lookup",
  description:
    "Bounded offline reference: Nose-itching/quarrel sayings assign meanings differently across local versions. Source: Simpson and Roud, A Dictionary of English Folklore. Not a prediction of conflict or medical explanation of itching. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
