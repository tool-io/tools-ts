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
          "The 1812 Grimm Rapunzel includes a pregnancy-revealing remark; later editions revise how the visitor is disclosed.",
        reference: "Grimm, KHM12,1812 and later editions.",
        limitations:
          "Edition-specific textual comparison, not a claim that every oral/later version contains identical details.",
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
      text: "The 1812 Grimm Rapunzel includes a pregnancy-revealing remark; later editions revise how the visitor is disclosed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/rapunzel-pregnancy-weight-tell-original-grimm-detail",
  title: "Rapunzel Pregnancy Weight Tell Original Grimm Detail",
  description:
    "Bounded offline reference: The 1812 Grimm Rapunzel includes a pregnancy-revealing remark; later editions revise how the visitor is disclosed. Source: Grimm, KHM12,1812 and later editions. Edition-specific textual comparison, not a claim that every oral/later version contains identical details. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
