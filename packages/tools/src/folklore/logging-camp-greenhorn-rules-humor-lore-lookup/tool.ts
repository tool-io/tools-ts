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
          "Logging-camp greenhorn stories use initiation jokes, occupational knowledge and exaggerated rules.",
        reference: "Dorson, American Folklore, occupational traditions.",
        limitations:
          "Not every printed anecdote is authentic camp practice; no hazing or hazardous instructions.",
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
      text: "Logging-camp greenhorn stories use initiation jokes, occupational knowledge and exaggerated rules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/logging-camp-greenhorn-rules-humor-lore-lookup",
  title: "Logging Camp Greenhorn Rules Humor Lore Lookup",
  description:
    "Bounded offline reference: Logging-camp greenhorn stories use initiation jokes, occupational knowledge and exaggerated rules. Source: Dorson, American Folklore, occupational traditions. Not every printed anecdote is authentic camp practice; no hazing or hazardous instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
