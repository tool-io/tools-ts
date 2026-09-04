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
          "The clinking-glasses poison-mixing origin story is not established by reliable historical evidence.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, drinking customs.",
        limitations:
          "Do not present conjecture as a verified universal origin.",
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
      text: "The clinking-glasses poison-mixing origin story is not established by reliable historical evidence.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/toasting-clink-glasses-poison-history-lookup",
  title: "Toasting Clink Glasses Poison History Lookup",
  description:
    "Bounded offline reference: The clinking-glasses poison-mixing origin story is not established by reliable historical evidence. Source: Simpson and Roud, A Dictionary of English Folklore, drinking customs. Do not present conjecture as a verified universal origin. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
