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
          "A conventional Roman educational sequence distinguishes elementary instruction, grammatical/literary study and rhetorical training.",
        reference:
          "Quintilian, Institutio Oratoria; Roman education scholarship.",
        limitations:
          "Access and paths varied by status, place and period; not mandatory three-stage schooling for everyone.",
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
      text: "A conventional Roman educational sequence distinguishes elementary instruction, grammatical/literary study and rhetorical training.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ludus-grammaticus-rhetor-three-stage-education-lookup",
  title: "Ludus Grammaticus Rhetor Three Stage Education Lookup",
  description:
    "Bounded offline reference: A conventional Roman educational sequence distinguishes elementary instruction, grammatical/literary study and rhetorical training. Source: Quintilian, Institutio Oratoria; Roman education scholarship. Access and paths varied by status, place and period; not mandatory three-stage schooling for everyone. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
