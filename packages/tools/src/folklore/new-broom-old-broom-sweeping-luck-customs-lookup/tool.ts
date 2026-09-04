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
          "Broom/new-home customs assign different meanings to old and new brooms in local versions.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "No universal required household action or efficacy claim.",
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
      text: "Broom/new-home customs assign different meanings to old and new brooms in local versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/new-broom-old-broom-sweeping-luck-customs-lookup",
  title: "New Broom Old Broom Sweeping Luck Customs Lookup",
  description:
    "Bounded offline reference: Broom/new-home customs assign different meanings to old and new brooms in local versions. Source: Simpson and Roud, A Dictionary of English Folklore. No universal required household action or efficacy claim. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
