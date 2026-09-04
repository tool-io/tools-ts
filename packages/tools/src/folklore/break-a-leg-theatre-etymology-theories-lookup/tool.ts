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
          "Break a leg is a conventional theatrical encouragement with multiple disputed etymologies.",
        reference:
          "Simpson and Roud, A Dictionary of English Folklore, theatre customs.",
        limitations:
          "No one origin theory is treated as securely established or as a wish for injury.",
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
      text: "Break a leg is a conventional theatrical encouragement with multiple disputed etymologies.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/break-a-leg-theatre-etymology-theories-lookup",
  title: "Break a Leg Theatre Etymology Theories Lookup",
  description:
    "Bounded offline reference: Break a leg is a conventional theatrical encouragement with multiple disputed etymologies. Source: Simpson and Roud, A Dictionary of English Folklore, theatre customs. No one origin theory is treated as securely established or as a wish for injury. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
