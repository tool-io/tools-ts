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
          "An 1861 US federal income-tax measure preceded revised Civil-War taxes, and the later temporary income tax expired in 1872.",
        reference: "IRS, history of the US tax system; Civil-War revenue acts.",
        limitations:
          "Distinct statutes and implementation dates matter; not every modern income-tax provision derives unchanged from 1861.",
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
      text: "An 1861 US federal income-tax measure preceded revised Civil-War taxes, and the later temporary income tax expired in 1872.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/civil-war-1861-first-federal-income-tax-repealed-history",
  title: "Civil War 1861 First Federal Income Tax Repealed History",
  description:
    "Bounded offline reference: An 1861 US federal income-tax measure preceded revised Civil-War taxes, and the later temporary income tax expired in 1872. Source: IRS, history of the US tax system; Civil-War revenue acts. Distinct statutes and implementation dates matter; not every modern income-tax provision derives unchanged from 1861. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
