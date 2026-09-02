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
          "Greenbergs modernist criticism emphasizes medium-specific conventions and self-critical attention to artistic means.",
        reference: "Greenberg, Modernist Painting 1960.",
        limitations:
          "A contested critical thesis, not a timeless exclusion rule or proof of quality.",
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
      text: "Greenbergs modernist criticism emphasizes medium-specific conventions and self-critical attention to artistic means.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/greenberg-medium-specificity-formalism-lookup",
  title: "Greenberg Medium Specificity Formalism Lookup",
  description:
    "Bounded offline reference: Greenbergs modernist criticism emphasizes medium-specific conventions and self-critical attention to artistic means. Source: Greenberg, Modernist Painting 1960. A contested critical thesis, not a timeless exclusion rule or proof of quality. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
