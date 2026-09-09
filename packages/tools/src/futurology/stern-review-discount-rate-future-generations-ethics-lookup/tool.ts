import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "The SternReview uses ethical/economic assumptions about discounting future climate damages; pure time preference and consumption growth/elasticity are distinct components.",
        reference: "SternReview 2006.",
        limitations:
          "Disputed normative assumptions, not one universally correct investment discount rate.",
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
      text: "The SternReview uses ethical/economic assumptions about discounting future climate damages; pure time preference and consumption growth/elasticity are distinct components.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/stern-review-discount-rate-future-generations-ethics-lookup",
  title: "Stern Review Discount Rate Future Generations Ethics Lookup",
  description:
    "Bounded offline reference: The SternReview uses ethical/economic assumptions about discounting future climate damages; pure time preference and consumption growth/elasticity are distinct components. Source: SternReview 2006. Disputed normative assumptions, not one universally correct investment discount rate. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
