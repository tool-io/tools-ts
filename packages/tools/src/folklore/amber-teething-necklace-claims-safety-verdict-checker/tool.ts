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
          "Amber teething necklaces have no established teething-pain benefit and can present choking/strangulation hazards.",
        reference: "US FDA 2018, teething-jewelry safety communication.",
        limitations:
          "Not a safe substitute for qualified pediatric guidance; no treatment regimen or efficacy claim.",
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
      text: "Amber teething necklaces have no established teething-pain benefit and can present choking/strangulation hazards.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/amber-teething-necklace-claims-safety-verdict-checker",
  title: "Amber Teething Necklace Claims Safety Verdict Checker",
  description:
    "Bounded offline reference: Amber teething necklaces have no established teething-pain benefit and can present choking/strangulation hazards. Source: US FDA 2018, teething-jewelry safety communication. Not a safe substitute for qualified pediatric guidance; no treatment regimen or efficacy claim. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
