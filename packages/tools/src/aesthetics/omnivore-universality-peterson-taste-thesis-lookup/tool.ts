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
          "Petersons cultural-omnivore thesis concerns patterns of breadth in tastes rather than universal liking of everything.",
        reference: "Peterson and Kern, Changing Highbrow Taste 1996.",
        limitations:
          "Patterns depend on cohort and measure; no individual class or universality diagnosis.",
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
      text: "Petersons cultural-omnivore thesis concerns patterns of breadth in tastes rather than universal liking of everything.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/omnivore-universality-peterson-taste-thesis-lookup",
  title: "Omnivore Universality Peterson Taste Thesis Lookup",
  description:
    "Bounded offline reference: Petersons cultural-omnivore thesis concerns patterns of breadth in tastes rather than universal liking of everything. Source: Peterson and Kern, Changing Highbrow Taste 1996. Patterns depend on cohort and measure; no individual class or universality diagnosis. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
