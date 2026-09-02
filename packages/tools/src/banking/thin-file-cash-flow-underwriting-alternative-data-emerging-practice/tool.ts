import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
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
          "Cash-flow and other alternative data can inform thin-file underwriting, but relevance, consent, accuracy and disparate impacts need evaluation.",
        reference: "CFPB, alternative-data underwriting research.",
        limitations:
          "No approval prediction, fairness certification or inferred income from unverified transaction labels.",
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
      text: "Cash-flow and other alternative data can inform thin-file underwriting, but relevance, consent, accuracy and disparate impacts need evaluation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/thin-file-cash-flow-underwriting-alternative-data-emerging-practice",
  title: "Thin File Cash Flow Underwriting Alternative Data Emerging Practice",
  description:
    "Bounded offline reference: Cash-flow and other alternative data can inform thin-file underwriting, but relevance, consent, accuracy and disparate impacts need evaluation. Source: CFPB, alternative-data underwriting research. No approval prediction, fairness certification or inferred income from unverified transaction labels. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
