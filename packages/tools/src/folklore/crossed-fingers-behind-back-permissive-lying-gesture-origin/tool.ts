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
          "Crossed-finger gestures can express luck or a claimed exemption from a promise in particular versions.",
        reference: "Gesture and superstition scholarship.",
        limitations:
          "No proven permission to lie, legal release from a promise or universal gesture meaning.",
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
      text: "Crossed-finger gestures can express luck or a claimed exemption from a promise in particular versions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/crossed-fingers-behind-back-permissive-lying-gesture-origin",
  title: "Crossed Fingers Behind Back Permissive Lying Gesture Origin",
  description:
    "Bounded offline reference: Crossed-finger gestures can express luck or a claimed exemption from a promise in particular versions. Source: Gesture and superstition scholarship. No proven permission to lie, legal release from a promise or universal gesture meaning. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
