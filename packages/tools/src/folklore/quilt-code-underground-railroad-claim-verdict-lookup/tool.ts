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
          "The popular fixed Underground Railroad quilt-code narrative lacks the documentary support needed for a universal historically established signaling system.",
        reference:
          "National Park Service, Underground Railroad quilt-code interpretation resources.",
        limitations:
          "This does not prove no individual ever used a textile as a signal; distinguish documented cases from modern retrospective stories.",
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
      text: "The popular fixed Underground Railroad quilt-code narrative lacks the documentary support needed for a universal historically established signaling system.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/quilt-code-underground-railroad-claim-verdict-lookup",
  title: "Quilt Code Underground Railroad Claim Verdict Lookup",
  description:
    "Bounded offline reference: The popular fixed Underground Railroad quilt-code narrative lacks the documentary support needed for a universal historically established signaling system. Source: National Park Service, Underground Railroad quilt-code interpretation resources. This does not prove no individual ever used a textile as a signal; distinguish documented cases from modern retrospective stories. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
