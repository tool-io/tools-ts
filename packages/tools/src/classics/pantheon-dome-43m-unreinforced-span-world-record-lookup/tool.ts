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
          "The Pantheons concrete dome spans roughly 43.3 metres and is commonly discussed as the largest unreinforced concrete dome.",
        reference:
          "Pantheon architectural surveys and conservation scholarship.",
        limitations:
          "Approximate measured historic span, not an exhaustive current record audit or structural safety assertion.",
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
      text: "The Pantheons concrete dome spans roughly 43.3 metres and is commonly discussed as the largest unreinforced concrete dome.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/pantheon-dome-43m-unreinforced-span-world-record-lookup",
  title: "Pantheon Dome 43m Unreinforced Span World Record Lookup",
  description:
    "Bounded offline reference: The Pantheons concrete dome spans roughly 43.3 metres and is commonly discussed as the largest unreinforced concrete dome. Source: Pantheon architectural surveys and conservation scholarship. Approximate measured historic span, not an exhaustive current record audit or structural safety assertion. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
