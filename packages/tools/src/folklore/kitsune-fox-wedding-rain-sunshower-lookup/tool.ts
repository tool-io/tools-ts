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
          "Japanese fox-wedding expressions can be associated with sunshowers or unusual lights in particular traditions.",
        reference: "Japanese folklore studies; Foster, The Book of Y\u014dkai.",
        limitations:
          "Not proof of an actual fox wedding or a universal Japanese belief.",
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
      text: "Japanese fox-wedding expressions can be associated with sunshowers or unusual lights in particular traditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/kitsune-fox-wedding-rain-sunshower-lookup",
  title: "Kitsune Fox Wedding Rain Sunshower Lookup",
  description:
    "Bounded offline reference: Japanese fox-wedding expressions can be associated with sunshowers or unusual lights in particular traditions. Source: Japanese folklore studies; Foster, The Book of Y\u014dkai. Not proof of an actual fox wedding or a universal Japanese belief. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
