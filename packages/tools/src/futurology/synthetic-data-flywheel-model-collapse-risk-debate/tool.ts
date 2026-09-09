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
          "Repeated training on model-generated data can distort distributions in some settings; curated/verified synthetic data can also be useful.",
        reference:
          "Shumailovet al., model-collapse research; synthetic-data research literature.",
        limitations:
          "Effects depend on replacement, mixing, quality and learning process; not every synthetic dataset necessarily collapses.",
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
      text: "Repeated training on model-generated data can distort distributions in some settings; curated/verified synthetic data can also be useful.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/synthetic-data-flywheel-model-collapse-risk-debate",
  title: "Synthetic Data Flywheel Model Collapse Risk Debate",
  description:
    "Bounded offline reference: Repeated training on model-generated data can distort distributions in some settings; curated/verified synthetic data can also be useful. Source: Shumailovet al., model-collapse research; synthetic-data research literature. Effects depend on replacement, mixing, quality and learning process; not every synthetic dataset necessarily collapses. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
