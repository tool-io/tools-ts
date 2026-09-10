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
          "Hemp-house line systems use historically distinct rope/cleat/counterweight practices from modern counterweight and powered systems.",
        reference:
          "Theatre rigging history and qualified manufacturer guidance.",
        limitations:
          "Overview only, no tying, locking, loading or operating instructions; competent engineering/rigging review required.",
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
      text: "Hemp-house line systems use historically distinct rope/cleat/counterweight practices from modern counterweight and powered systems.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/hemp-house-lock-line-system-lookup",
  title: "Hemp House Lock Line System Lookup",
  description:
    "Bounded offline reference: Hemp-house line systems use historically distinct rope/cleat/counterweight practices from modern counterweight and powered systems. Source: Theatre rigging history and qualified manufacturer guidance. Overview only, no tying, locking, loading or operating instructions; competent engineering/rigging review required. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
