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
          "Songkran is a Thai traditional New Year celebration with water-related, merit-making and community practices.",
        reference: "UNESCO, Songkran in Thailand.",
        limitations:
          "Dates and practices vary by locality; not merely a water fight or permission to splash unwilling people.",
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
      text: "Songkran is a Thai traditional New Year celebration with water-related, merit-making and community practices.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/songkran-water-splashing-thai-new-year-meaning-lookup",
  title: "Songkran Water Splashing Thai New Year Meaning Lookup",
  description:
    "Bounded offline reference: Songkran is a Thai traditional New Year celebration with water-related, merit-making and community practices. Source: UNESCO, Songkran in Thailand. Dates and practices vary by locality; not merely a water fight or permission to splash unwilling people. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
