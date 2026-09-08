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
          "Minimal gene inventories are environment- and organism-dependent; JCVI-syn3.0reported473genes in a specific laboratory minimal cell.",
        reference: "Hutchisonet al., Science 2016.",
        limitations:
          "Not a universal lower bound of life or a genome synthesis protocol.",
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
      text: "Minimal gene inventories are environment- and organism-dependent; JCVI-syn3.0reported473genes in a specific laboratory minimal cell.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/minimal-genome-gene-count-lookup",
  title: "Genome Size Minimal Gene Set Count Lower Bound Lookup",
  description:
    "Bounded offline reference: Minimal gene inventories are environment- and organism-dependent; JCVI-syn3.0reported473genes in a specific laboratory minimal cell. Source: Hutchisonet al., Science 2016. Not a universal lower bound of life or a genome synthesis protocol. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
