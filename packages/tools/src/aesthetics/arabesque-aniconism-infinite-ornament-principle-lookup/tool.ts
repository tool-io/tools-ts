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
          "Arabesque ornament can organize repeated vegetal/geometric forms; aniconic practices vary by medium, setting and era.",
        reference:
          "Islamic art-historical scholarship; Grabar, The Mediation of Ornament.",
        limitations:
          "Not a universal ban on figures or one homogeneous Islamic design doctrine.",
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
      text: "Arabesque ornament can organize repeated vegetal/geometric forms; aniconic practices vary by medium, setting and era.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/arabesque-aniconism-infinite-ornament-principle-lookup",
  title: "Arabesque Aniconism Infinite Ornament Principle Lookup",
  description:
    "Bounded offline reference: Arabesque ornament can organize repeated vegetal/geometric forms; aniconic practices vary by medium, setting and era. Source: Islamic art-historical scholarship; Grabar, The Mediation of Ornament. Not a universal ban on figures or one homogeneous Islamic design doctrine. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
