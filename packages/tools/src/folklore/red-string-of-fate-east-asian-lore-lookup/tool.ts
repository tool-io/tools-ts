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
          "Red-thread-of-fate narratives occur in particular East Asian literary and popular traditions.",
        reference:
          "Chinese Yue Lao narrative tradition; comparative East Asian folklore scholarship.",
        limitations:
          "Traditions and later adaptations differ; no inevitable partner or relationship prediction.",
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
      text: "Red-thread-of-fate narratives occur in particular East Asian literary and popular traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/red-string-of-fate-east-asian-lore-lookup",
  title: "Red String of Fate East Asian Lore Lookup",
  description:
    "Bounded offline reference: Red-thread-of-fate narratives occur in particular East Asian literary and popular traditions. Source: Chinese Yue Lao narrative tradition; comparative East Asian folklore scholarship. Traditions and later adaptations differ; no inevitable partner or relationship prediction. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
