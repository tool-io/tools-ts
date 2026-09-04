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
          "Japanese confectionery traditions provide important antecedents to the modern American fortune cookie.",
        reference: "Nakamachi, Japanese fortune-cookie historical research.",
        limitations:
          "Commercial lineages are complex; no single universally established inventor or prediction efficacy.",
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
      text: "Japanese confectionery traditions provide important antecedents to the modern American fortune cookie.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/fortune-cookie-kyoto-japan-origin-lookup",
  title: "Fortune Cookie Kyoto Japan Origin Lookup",
  description:
    "Bounded offline reference: Japanese confectionery traditions provide important antecedents to the modern American fortune cookie. Source: Nakamachi, Japanese fortune-cookie historical research. Commercial lineages are complex; no single universally established inventor or prediction efficacy. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
