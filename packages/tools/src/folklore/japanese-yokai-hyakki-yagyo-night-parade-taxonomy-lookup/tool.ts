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
          "Y\u014dkai covers diverse uncanny beings/phenomena; Hyakki Yagy\u014d is a night-parade imagery tradition, not one stable biological taxonomy.",
        reference:
          "Foster, The Book of Y\u014dkai; Japanese Night Parade scroll traditions.",
        limitations:
          "Historical/visual reference only; names and classification vary by source and era.",
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
      text: "Y\u014dkai covers diverse uncanny beings/phenomena; Hyakki Yagy\u014d is a night-parade imagery tradition, not one stable biological taxonomy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/japanese-yokai-hyakki-yagyo-night-parade-taxonomy-lookup",
  title: "Japanese Y\u014dkai (Night Parade) Taxonomy Lookup",
  description:
    "Bounded offline reference: Y\u014dkai covers diverse uncanny beings/phenomena; Hyakki Yagy\u014d is a night-parade imagery tradition, not one stable biological taxonomy. Source: Foster, The Book of Y\u014dkai; Japanese Night Parade scroll traditions. Historical/visual reference only; names and classification vary by source and era. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
