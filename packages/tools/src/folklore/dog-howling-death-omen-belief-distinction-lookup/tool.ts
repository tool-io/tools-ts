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
          "Dog-howling death omens are beliefs distinct from the multiple ordinary causes of vocal behavior.",
        reference: "Animal behavior and superstition scholarship.",
        limitations:
          "No reliable prediction of death, diagnosis or veterinary assessment.",
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
      text: "Dog-howling death omens are beliefs distinct from the multiple ordinary causes of vocal behavior.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/dog-howling-death-omen-belief-distinction-lookup",
  title: "Dog Howling Death Omen Belief Distinction Lookup",
  description:
    "Bounded offline reference: Dog-howling death omens are beliefs distinct from the multiple ordinary causes of vocal behavior. Source: Animal behavior and superstition scholarship. No reliable prediction of death, diagnosis or veterinary assessment. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
