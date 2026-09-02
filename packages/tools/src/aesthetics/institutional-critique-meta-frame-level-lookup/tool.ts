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
          "Institutional critique examines the framing, power, economics and practices that condition art display and legitimacy.",
        reference: "Fraser and institutional-critique scholarship.",
        limitations:
          "Meta-frame description alone does not prove an institution oppressive or the artwork effective.",
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
      text: "Institutional critique examines the framing, power, economics and practices that condition art display and legitimacy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/institutional-critique-meta-frame-level-lookup",
  title: "Institutional Critique Meta Frame Level Lookup",
  description:
    "Bounded offline reference: Institutional critique examines the framing, power, economics and practices that condition art display and legitimacy. Source: Fraser and institutional-critique scholarship. Meta-frame description alone does not prove an institution oppressive or the artwork effective. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
