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
          "Standing Liberty quarters changed in 1917 from Type Ito Type II, including the covered/chained-mail torso and reverse changes.",
        reference: "US Mint/Standing Liberty quarter catalogues.",
        limitations:
          "Date alone does not identify type; later date-recessing changes are separate.",
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
      text: "Standing Liberty quarters changed in 1917 from Type Ito Type II, including the covered/chained-mail torso and reverse changes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/type-one-type-two-standing-liberty-1917-change-lookup",
  title: "Type One Type Two Standing Liberty 1917 Change Lookup",
  description:
    "Bounded offline reference: Standing Liberty quarters changed in 1917 from Type Ito Type II, including the covered/chained-mail torso and reverse changes. Source: US Mint/Standing Liberty quarter catalogues. Date alone does not identify type; later date-recessing changes are separate. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
