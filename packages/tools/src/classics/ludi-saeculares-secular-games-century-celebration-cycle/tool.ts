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
          "Roman secular games invoked renewal across a saeculum, but historical celebrations and claimed cycles differed.",
        reference:
          "Horace, Carmen Saeculare; secular-games inscriptions and Roman religion scholarship.",
        limitations:
          "A saeculumis not a universal exactly100-year countdown and imperial schedules were politically constructed.",
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
      text: "Roman secular games invoked renewal across a saeculum, but historical celebrations and claimed cycles differed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/ludi-saeculares-secular-games-century-celebration-cycle",
  title: "Ludi Saeculares Secular Games Century Celebration Cycle",
  description:
    "Bounded offline reference: Roman secular games invoked renewal across a saeculum, but historical celebrations and claimed cycles differed. Source: Horace, Carmen Saeculare; secular-games inscriptions and Roman religion scholarship. A saeculumis not a universal exactly100-year countdown and imperial schedules were politically constructed. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
