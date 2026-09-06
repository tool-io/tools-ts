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
          "Krugerrands are bullion legal-tender coins without a printed fixed numeric face value, with gold content central to their value framework.",
        reference: "South African Mint, Krugerrand descriptions.",
        limitations:
          "No face value does not mean counterfeit or universally tax/transaction exempt; current law and product matter.",
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
      text: "Krugerrands are bullion legal-tender coins without a printed fixed numeric face value, with gold content central to their value framework.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/krugerrand-no-face-value-bullion-status-note",
  title: "Krugerrand No Face Value Bullion Status Note",
  description:
    "Bounded offline reference: Krugerrands are bullion legal-tender coins without a printed fixed numeric face value, with gold content central to their value framework. Source: South African Mint, Krugerrand descriptions. No face value does not mean counterfeit or universally tax/transaction exempt; current law and product matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
