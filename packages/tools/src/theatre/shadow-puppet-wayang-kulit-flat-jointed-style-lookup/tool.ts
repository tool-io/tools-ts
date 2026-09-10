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
          "Wayang kulit uses flat articulated shadow puppets within specific Indonesian performance traditions.",
        reference: "UNESCO, Wayang puppet theatre.",
        limitations:
          "Community, region, story and permissions vary; not one homogeneous pan-Asian form.",
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
      text: "Wayang kulit uses flat articulated shadow puppets within specific Indonesian performance traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/shadow-puppet-wayang-kulit-flat-jointed-style-lookup",
  title: "Shadow Puppet Wayang Kulit Flat Jointed Style Lookup",
  description:
    "Bounded offline reference: Wayang kulit uses flat articulated shadow puppets within specific Indonesian performance traditions. Source: UNESCO, Wayang puppet theatre. Community, region, story and permissions vary; not one homogeneous pan-Asian form. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
