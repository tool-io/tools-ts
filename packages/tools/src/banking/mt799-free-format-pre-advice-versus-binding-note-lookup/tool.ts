import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "MT799 is a free-format bank message and is not by its message type alone a guarantee, credit facility or transferred funds.",
        reference: "SWIFT, MT799category7standards.",
        limitations:
          "Verify the actual authenticated text and legal instrument; a pre-advice screenshot is not proof of cash or binding commitment.",
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
      text: "MT799 is a free-format bank message and is not by its message type alone a guarantee, credit facility or transferred funds.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/mt799-free-format-pre-advice-versus-binding-note-lookup",
  title: "MT799 Free Format Pre Advice Versus Binding Note Lookup",
  description:
    "Bounded offline reference: MT799 is a free-format bank message and is not by its message type alone a guarantee, credit facility or transferred funds. Source: SWIFT, MT799category7standards. Verify the actual authenticated text and legal instrument; a pre-advice screenshot is not proof of cash or binding commitment. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
