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
          "Degrowth critiques growth-dependent high-income economies; postgrowth explores wellbeing without dependence on continual GDPgrowth, with diverse proponents and policy views.",
        reference: "Degrowth/postgrowth scholarship.",
        limitations:
          "Not one unified programme or evidence every contraction improves wellbeing.",
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
      text: "Degrowth critiques growth-dependent high-income economies; postgrowth explores wellbeing without dependence on continual GDPgrowth, with diverse proponents and policy views.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/degrowth-postgrowth-economy-proponents-taxonomy-lookup",
  title: "Degrowth Postgrowth Economy Proponents Taxonomy Lookup",
  description:
    "Bounded offline reference: Degrowth critiques growth-dependent high-income economies; postgrowth explores wellbeing without dependence on continual GDPgrowth, with diverse proponents and policy views. Source: Degrowth/postgrowth scholarship. Not one unified programme or evidence every contraction improves wellbeing. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
