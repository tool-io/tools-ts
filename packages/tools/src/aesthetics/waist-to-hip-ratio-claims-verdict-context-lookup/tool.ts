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
          "Waist-to-hip preference claims are population, method and context dependent and do not establish a universally ideal body.",
        reference:
          "Critical body-perception and cross-cultural attractiveness research.",
        limitations:
          "No health, fertility, gender or personal-value assessment from a ratio.",
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
      text: "Waist-to-hip preference claims are population, method and context dependent and do not establish a universally ideal body.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/waist-to-hip-ratio-claims-verdict-context-lookup",
  title: "Waist to Hip Ratio Claims Verdict Context Lookup",
  description:
    "Bounded offline reference: Waist-to-hip preference claims are population, method and context dependent and do not establish a universally ideal body. Source: Critical body-perception and cross-cultural attractiveness research. No health, fertility, gender or personal-value assessment from a ratio. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
