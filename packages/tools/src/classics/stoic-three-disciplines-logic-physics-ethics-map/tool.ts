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
          "Stoic teaching conventionally divides philosophy into logic, physics and ethics; Hadots disciplines of assent, desire and action are a different framing.",
        reference: "Diogenes Laertius 7.39\u201341; Hadot, The Inner Citadel.",
        limitations:
          "The milestone fields and practice disciplines should not be conflated or used as clinical advice.",
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
      text: "Stoic teaching conventionally divides philosophy into logic, physics and ethics; Hadots disciplines of assent, desire and action are a different framing.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/stoic-three-disciplines-logic-physics-ethics-map",
  title: "Stoic Three Disciplines Logic Physics Ethics Map",
  description:
    "Bounded offline reference: Stoic teaching conventionally divides philosophy into logic, physics and ethics; Hadots disciplines of assent, desire and action are a different framing. Source: Diogenes Laertius 7.39\u201341; Hadot, The Inner Citadel. The milestone fields and practice disciplines should not be conflated or used as clinical advice. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
