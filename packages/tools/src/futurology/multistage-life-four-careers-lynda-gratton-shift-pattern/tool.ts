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
          "Gratton and Scotts multistage-life argument challenges the education/work/retirement three-stage pattern. Exactly four careers is not a universal prescription.",
        reference: "Grattonand Scott, The100-Year Life 2016.",
        limitations:
          "Conceptual possibilities, not a lifespan or career forecast.",
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
      text: "Gratton and Scotts multistage-life argument challenges the education/work/retirement three-stage pattern. Exactly four careers is not a universal prescription.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/multistage-life-four-careers-lynda-gratton-shift-pattern",
  title: "Multistage Life Four Careers Lynda Gratton Shift Pattern",
  description:
    "Bounded offline reference: Gratton and Scotts multistage-life argument challenges the education/work/retirement three-stage pattern. Exactly four careers is not a universal prescription. Source: Grattonand Scott, The100-Year Life 2016. Conceptual possibilities, not a lifespan or career forecast. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
