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
          "Dickies institutional account connects art status with an artworld framework and candidate-for-appreciation presentation.",
        reference: "Dickie, Art and the Aesthetic 1974; The Art Circle 1984.",
        limitations:
          "Versions of the theory differ; institutional recognition is not universal legal status or quality.",
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
      text: "Dickies institutional account connects art status with an artworld framework and candidate-for-appreciation presentation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/dickie-institutional-theory-steps-lookup",
  title: "Dickie Institutional Theory Steps Lookup",
  description:
    "Bounded offline reference: Dickies institutional account connects art status with an artworld framework and candidate-for-appreciation presentation. Source: Dickie, Art and the Aesthetic 1974; The Art Circle 1984. Versions of the theory differ; institutional recognition is not universal legal status or quality. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
