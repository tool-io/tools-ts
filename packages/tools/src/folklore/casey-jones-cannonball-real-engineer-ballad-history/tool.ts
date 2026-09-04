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
          "Casey Jones ballads draw on railroad engineer John Luther Jones and his fatal 1900 train wreck.",
        reference:
          "American railroad ballad collections; Casey Jones historical records.",
        limitations:
          "Ballad embellishments and historical events must be distinguished.",
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
      text: "Casey Jones ballads draw on railroad engineer John Luther Jones and his fatal 1900 train wreck.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/casey-jones-cannonball-real-engineer-ballad-history",
  title: "Casey Jones Cannonball Real Engineer Ballad History",
  description:
    "Bounded offline reference: Casey Jones ballads draw on railroad engineer John Luther Jones and his fatal 1900 train wreck. Source: American railroad ballad collections; Casey Jones historical records. Ballad embellishments and historical events must be distinguished. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
