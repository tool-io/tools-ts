import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Reasoning-model approaches can allocate more inference-time computation to improve particular measured tasks.",
        reference: "Test-timecompute and reasoning-model research literature.",
        limitations:
          "No universal scaling law, guaranteed reasoning reliability or current o-series benchmark inventory.",
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
      text: "Reasoning-model approaches can allocate more inference-time computation to improve particular measured tasks.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/reasoning-model-o-series-scaling-paradigm-shift-note",
  title: "Reasoning Model O Series Scaling Paradigm Shift Note",
  description:
    "Bounded offline reference: Reasoning-model approaches can allocate more inference-time computation to improve particular measured tasks. Source: Test-timecompute and reasoning-model research literature. No universal scaling law, guaranteed reasoning reliability or current o-series benchmark inventory. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
