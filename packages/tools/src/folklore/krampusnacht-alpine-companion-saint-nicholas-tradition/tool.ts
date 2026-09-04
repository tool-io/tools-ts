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
          "Krampus accompanies Saint Nicholas in some Alpine traditions, with Krampusnacht commonly associated with December 5.",
        reference: "Alpine Saint Nicholas/Krampus folklore scholarship.",
        limitations:
          "Regional variation and modern revival matter; no punishment, ritual or costume-safety instructions.",
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
      text: "Krampus accompanies Saint Nicholas in some Alpine traditions, with Krampusnacht commonly associated with December 5.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/krampusnacht-alpine-companion-saint-nicholas-tradition",
  title: "Krampusnacht Alpine Companion Saint Nicholas Tradition",
  description:
    "Bounded offline reference: Krampus accompanies Saint Nicholas in some Alpine traditions, with Krampusnacht commonly associated with December 5. Source: Alpine Saint Nicholas/Krampus folklore scholarship. Regional variation and modern revival matter; no punishment, ritual or costume-safety instructions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
