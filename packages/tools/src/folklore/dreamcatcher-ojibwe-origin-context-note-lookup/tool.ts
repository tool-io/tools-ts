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
          "Dreamcatchers have Ojibwe cultural contexts and later wider circulation.",
        reference: "Ojibwe community and museum interpretation resources.",
        limitations:
          "Not all Indigenous communities share one custom; prioritize community-specific permission and avoid efficacy claims.",
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
      text: "Dreamcatchers have Ojibwe cultural contexts and later wider circulation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/dreamcatcher-ojibwe-origin-context-note-lookup",
  title: "Dreamcatcher Ojibwe Origin Context Note Lookup",
  description:
    "Bounded offline reference: Dreamcatchers have Ojibwe cultural contexts and later wider circulation. Source: Ojibwe community and museum interpretation resources. Not all Indigenous communities share one custom; prioritize community-specific permission and avoid efficacy claims. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
