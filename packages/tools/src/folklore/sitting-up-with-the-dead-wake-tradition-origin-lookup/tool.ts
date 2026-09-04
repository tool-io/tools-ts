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
          "Wakes and sitting-up-with-the-dead customs differ by community, period and religious context.",
        reference: "Funeral folklore and oral-history scholarship.",
        limitations:
          "No universal origin, safe health practice or obligation to follow a reported custom.",
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
      text: "Wakes and sitting-up-with-the-dead customs differ by community, period and religious context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/sitting-up-with-the-dead-wake-tradition-origin-lookup",
  title: "Sitting Up With the Dead Wake Tradition Origin Lookup",
  description:
    "Bounded offline reference: Wakes and sitting-up-with-the-dead customs differ by community, period and religious context. Source: Funeral folklore and oral-history scholarship. No universal origin, safe health practice or obligation to follow a reported custom. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
