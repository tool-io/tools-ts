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
          "Kidney-heist stories are widely studied as organ-theft urban legends.",
        reference: "Brunvand, Encyclopedia of Urban Legends.",
        limitations:
          "A specific allegation requires independent reliable evidence; do not equate all documented trafficking with the legend plot.",
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
      text: "Kidney-heist stories are widely studied as organ-theft urban legends.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/kidney-heist-organ-theft-legend-verdict-lookup",
  title: "Kidney Heist Organ Theft Legend Verdict Lookup",
  description:
    "Bounded offline reference: Kidney-heist stories are widely studied as organ-theft urban legends. Source: Brunvand, Encyclopedia of Urban Legends. A specific allegation requires independent reliable evidence; do not equate all documented trafficking with the legend plot. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
