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
          "Food contamination can occur rapidly on contact with a contaminated surface.",
        reference:
          "Miranda and Schaffner, Applied and Environmental Microbiology 2016, food transfer study.",
        limitations:
          "No five-second grace period or safety certification; transfer varies by food, surface, contamination and conditions.",
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
      text: "Food contamination can occur rapidly on contact with a contaminated surface.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/five-second-rule-food-floor-research-verdict-lookup",
  title: "Five Second Rule Food Floor Research Verdict Lookup",
  description:
    "Bounded offline reference: Food contamination can occur rapidly on contact with a contaminated surface. Source: Miranda and Schaffner, Applied and Environmental Microbiology 2016, food transfer study. No five-second grace period or safety certification; transfer varies by food, surface, contamination and conditions. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
