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
          "JCVI-syn3.0is a synthetic minimal-cell research genome reported in 2016 with 473genes under specific laboratory conditions.",
        reference: "Hutchisonet al., Science 2016, minimal bacterial genome.",
        limitations:
          "Not a universal lower bound for life, all environments or a complete functional explanation of every gene.",
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
      text: "JCVI-syn3.0is a synthetic minimal-cell research genome reported in 2016 with 473genes under specific laboratory conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/minimal-genome-jcvi-syn3-0-synthetic-biology-milestone",
  title: "Minimal Genome Jcvisyn3.0 Synthetic Biology Milestone",
  description:
    "Bounded offline reference: JCVI-syn3.0is a synthetic minimal-cell research genome reported in 2016 with 473genes under specific laboratory conditions. Source: Hutchisonet al., Science 2016, minimal bacterial genome. Not a universal lower bound for life, all environments or a complete functional explanation of every gene. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
