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
          "Busking adapts live control to events; cue stacks organize preset sequences, and productions can combine them.",
        reference: "Lighting console programming practice.",
        limitations:
          "Philosophy is not a validated workflow, hardware compatibility or permission to alter a live show.",
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
      text: "Busking adapts live control to events; cue stacks organize preset sequences, and productions can combine them.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/busking-versus-cue-stack-console-programming-philosophy",
  title: "Busking Versus Cue Stack Console Programming Philosophy",
  description:
    "Bounded offline reference: Busking adapts live control to events; cue stacks organize preset sequences, and productions can combine them. Source: Lighting console programming practice. Philosophy is not a validated workflow, hardware compatibility or permission to alter a live show. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
