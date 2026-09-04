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
          "Coins at wells and water sites appear in varied wishing and votive customs.",
        reference: "Simpson and Roud, A Dictionary of English Folklore.",
        limitations:
          "Historical description does not imply effective wishes or permission to leave objects at protected sites.",
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
      text: "Coins at wells and water sites appear in varied wishing and votive customs.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/wishing-well-coin-toss-custom-lookup",
  title: "Wishing Well Coin Toss Custom Lookup",
  description:
    "Bounded offline reference: Coins at wells and water sites appear in varied wishing and votive customs. Source: Simpson and Roud, A Dictionary of English Folklore. Historical description does not imply effective wishes or permission to leave objects at protected sites. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
