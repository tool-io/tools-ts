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
          "The 1965 Coinage Actchanged US dime/quarter compositions and introduced40%-silver Kennedy half dollars during 1965\u20131970.",
        reference: "US Coinage Act 1965; US Mint histories.",
        limitations:
          "Later clad halves and special silver issues differ; a date/denomination alone is not a universal assay.",
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
      text: "The 1965 Coinage Actchanged US dime/quarter compositions and introduced40%-silver Kennedy half dollars during 1965\u20131970.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/silver-clad-transition-1965-coinage-act-history",
  title: "Silver Clad Transition 1965 Coinage Act History",
  description:
    "Bounded offline reference: The 1965 Coinage Actchanged US dime/quarter compositions and introduced40%-silver Kennedy half dollars during 1965\u20131970. Source: US Coinage Act 1965; US Mint histories. Later clad halves and special silver issues differ; a date/denomination alone is not a universal assay. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
