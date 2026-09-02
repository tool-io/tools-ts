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
          "OD ohertys white-cube essays analyze apparently neutral gallery space as a historically constructed ideological/display frame.",
        reference: "OD oherty, Inside the White Cube 1976 essays.",
        limitations:
          "A white wall does not by itself establish every institutional effect.",
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
      text: "OD ohertys white-cube essays analyze apparently neutral gallery space as a historically constructed ideological/display frame.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/white-cube-gallery-space-odoherty-inside-context-lookup",
  title: "White Cube Gallery Space Odoherty Inside Context Lookup",
  description:
    "Bounded offline reference: OD ohertys white-cube essays analyze apparently neutral gallery space as a historically constructed ideological/display frame. Source: OD oherty, Inside the White Cube 1976 essays. A white wall does not by itself establish every institutional effect. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
