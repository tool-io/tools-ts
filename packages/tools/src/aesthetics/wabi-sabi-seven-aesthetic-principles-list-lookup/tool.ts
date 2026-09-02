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
          "Seven-principle lists commonly linked to Zen aesthetics include asymmetry, simplicity, austere sublimity, naturalness, subtle profundity, freedom and tranquility.",
        reference: "Hisamatsu, Zen and the Fine Arts 1971.",
        limitations:
          "This specific modern interpretive list is not a universally canonical definition of all wabi-sabi.",
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
      text: "Seven-principle lists commonly linked to Zen aesthetics include asymmetry, simplicity, austere sublimity, naturalness, subtle profundity, freedom and tranquility.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/wabi-sabi-seven-aesthetic-principles-list-lookup",
  title: "Wabi Sabi Seven Aesthetic Principles List Lookup",
  description:
    "Bounded offline reference: Seven-principle lists commonly linked to Zen aesthetics include asymmetry, simplicity, austere sublimity, naturalness, subtle profundity, freedom and tranquility. Source: Hisamatsu, Zen and the Fine Arts 1971. This specific modern interpretive list is not a universally canonical definition of all wabi-sabi. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
