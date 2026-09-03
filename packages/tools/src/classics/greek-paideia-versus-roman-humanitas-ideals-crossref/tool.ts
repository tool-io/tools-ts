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
          "Paideia and humanitas concern culturally situated educational/cultivating ideals with overlapping but nonidentical histories.",
        reference: "Cicero; Greek education and Roman reception scholarship.",
        limitations:
          "Not simple national personality types or universal literal translations.",
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
      text: "Paideia and humanitas concern culturally situated educational/cultivating ideals with overlapping but nonidentical histories.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/greek-paideia-versus-roman-humanitas-ideals-crossref",
  title: "Greek Paideia Versus Roman Humanitas Ideals Crossref",
  description:
    "Bounded offline reference: Paideia and humanitas concern culturally situated educational/cultivating ideals with overlapping but nonidentical histories. Source: Cicero; Greek education and Roman reception scholarship. Not simple national personality types or universal literal translations. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
