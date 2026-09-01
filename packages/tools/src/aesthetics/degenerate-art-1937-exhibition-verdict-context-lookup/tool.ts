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
          "The 1937 Nazi Degenerate Art exhibition used racist/authoritarian classifications to stigmatize modern art and artists.",
        reference: "Barron, Degenerate Art; museum historical documentation.",
        limitations:
          "The label is a persecutory historical designation, not a valid aesthetic, medical or moral category.",
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
      text: "The 1937 Nazi Degenerate Art exhibition used racist/authoritarian classifications to stigmatize modern art and artists.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/degenerate-art-1937-exhibition-verdict-context-lookup",
  title: "Degenerate Art 1937 Exhibition Verdict Context Lookup",
  description:
    "Bounded offline reference: The 1937 Nazi Degenerate Art exhibition used racist/authoritarian classifications to stigmatize modern art and artists. Source: Barron, Degenerate Art; museum historical documentation. The label is a persecutory historical designation, not a valid aesthetic, medical or moral category. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
