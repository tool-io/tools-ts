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
          "Pangboche Yeti relic accounts involve disputed provenance, expedition history and later examinations.",
        reference: "Himalayan expedition and relic-provenance scholarship.",
        limitations:
          "No relic authentication or complete current laboratory verdict fabricated.",
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
      text: "Pangboche Yeti relic accounts involve disputed provenance, expedition history and later examinations.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/yeti-scalp-relic-panboche-monastery-expedition-lookup",
  title: "Yeti Scalp Relic Panboche Monastery Expedition Lookup",
  description:
    "Bounded offline reference: Pangboche Yeti relic accounts involve disputed provenance, expedition history and later examinations. Source: Himalayan expedition and relic-provenance scholarship. No relic authentication or complete current laboratory verdict fabricated. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
