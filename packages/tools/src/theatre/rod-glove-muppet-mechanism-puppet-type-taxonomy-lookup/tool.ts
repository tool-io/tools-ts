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
          "Rod, glove/hand and hybrid puppet mechanisms organize control differently; Muppet refers to a particular creative tradition/brand context.",
        reference: "Puppet theatre mechanism literature.",
        limitations:
          "Mechanisms can combine; no universal control count or automatic attribution.",
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
      text: "Rod, glove/hand and hybrid puppet mechanisms organize control differently; Muppet refers to a particular creative tradition/brand context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/rod-glove-muppet-mechanism-puppet-type-taxonomy-lookup",
  title: "Rod Glove Muppet Mechanism Puppet Type Taxonomy Lookup",
  description:
    "Bounded offline reference: Rod, glove/hand and hybrid puppet mechanisms organize control differently; Muppet refers to a particular creative tradition/brand context. Source: Puppet theatre mechanism literature. Mechanisms can combine; no universal control count or automatic attribution. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
