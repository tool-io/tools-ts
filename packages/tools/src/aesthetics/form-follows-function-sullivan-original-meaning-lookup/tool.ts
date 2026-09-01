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
          "Sullivan writes form ever follows function within an organic argument about the tall office building.",
        reference:
          "Sullivan, The Tall Office Building Artistically Considered 1896.",
        limitations:
          "Not a universal ban on ornament or proof that only one form can serve a function.",
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
      text: "Sullivan writes form ever follows function within an organic argument about the tall office building.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/form-follows-function-sullivan-original-meaning-lookup",
  title: "Form Follows Function Sullivan Original Meaning Lookup",
  description:
    "Bounded offline reference: Sullivan writes form ever follows function within an organic argument about the tall office building. Source: Sullivan, The Tall Office Building Artistically Considered 1896. Not a universal ban on ornament or proof that only one form can serve a function. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
