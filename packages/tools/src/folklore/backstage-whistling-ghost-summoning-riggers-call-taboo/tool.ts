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
          "Backstage whistling prohibitions have occupational signaling and supernatural explanations in theatre folklore.",
        reference: "Theatre occupational folklore scholarship.",
        limitations:
          "A riggers-call explanation is not proven for every tradition; no backstage work-safety protocol supplied.",
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
      text: "Backstage whistling prohibitions have occupational signaling and supernatural explanations in theatre folklore.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/backstage-whistling-ghost-summoning-riggers-call-taboo",
  title: "Backstage Whistling Ghost Summoning Riggers Call Taboo",
  description:
    "Bounded offline reference: Backstage whistling prohibitions have occupational signaling and supernatural explanations in theatre folklore. Source: Theatre occupational folklore scholarship. A riggers-call explanation is not proven for every tradition; no backstage work-safety protocol supplied. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
