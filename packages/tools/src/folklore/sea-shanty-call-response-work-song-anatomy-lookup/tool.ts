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
          "Sea shanties coordinate some shipboard work through call/response and task-matched rhythmic forms.",
        reference: "Hugill, Shanties from the Seven Seas.",
        limitations:
          "Not every nautical song is a shanty or every task uses the same pattern.",
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
      text: "Sea shanties coordinate some shipboard work through call/response and task-matched rhythmic forms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/sea-shanty-call-response-work-song-anatomy-lookup",
  title: "Sea Shanty Call Response Work Song Anatomy Lookup",
  description:
    "Bounded offline reference: Sea shanties coordinate some shipboard work through call/response and task-matched rhythmic forms. Source: Hugill, Shanties from the Seven Seas. Not every nautical song is a shanty or every task uses the same pattern. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
