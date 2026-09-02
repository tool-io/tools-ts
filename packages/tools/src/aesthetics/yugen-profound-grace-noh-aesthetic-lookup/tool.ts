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
          "Y\u016bgen in Noh criticism can denote subtle, profound or mysterious grace shaped by textual and performance context.",
        reference: "Zeami, Noh treatises.",
        limitations:
          "No exact one-word translation, universal technique or automatic performance grade.",
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
      text: "Y\u016bgen in Noh criticism can denote subtle, profound or mysterious grace shaped by textual and performance context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/yugen-profound-grace-noh-aesthetic-lookup",
  title: "Yugen Profound Grace Noh Aesthetic Lookup",
  description:
    "Bounded offline reference: Y\u016bgen in Noh criticism can denote subtle, profound or mysterious grace shaped by textual and performance context. Source: Zeami, Noh treatises. No exact one-word translation, universal technique or automatic performance grade. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
