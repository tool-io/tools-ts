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
          "The charioteer Gaius Appuleius Diocles is associated with an inscribed career total of 35,863,120sestertii.",
        reference: "CIL 6.10048/ILS 5287.",
        limitations:
          "Ancient reported career earnings are not net personal wealth or reliably convertible to a modern worlds-richest-athlete ranking.",
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
      text: "The charioteer Gaius Appuleius Diocles is associated with an inscribed career total of 35,863,120sestertii.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/charioteer-diocles-35-million-sestertii-earnings-record",
  title: "Charioteer Diocles 35 Million Sestertii Earnings Record",
  description:
    "Bounded offline reference: The charioteer Gaius Appuleius Diocles is associated with an inscribed career total of 35,863,120sestertii. Source: CIL 6.10048/ILS 5287. Ancient reported career earnings are not net personal wealth or reliably convertible to a modern worlds-richest-athlete ranking. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
