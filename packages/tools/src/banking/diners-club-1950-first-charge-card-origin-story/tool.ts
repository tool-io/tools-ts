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
          "Diners Club launched in 1950 and is associated with the modern general-purpose charge-card story.",
        reference: "Diners Club corporate history; payment-card histories.",
        limitations:
          "Earlier merchant/charge instruments existed; first-ever-card language is too broad.",
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
      text: "Diners Club launched in 1950 and is associated with the modern general-purpose charge-card story.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/diners-club-1950-first-charge-card-origin-story",
  title: "Diners Club 1950 First Charge Card Origin Story",
  description:
    "Bounded offline reference: Diners Club launched in 1950 and is associated with the modern general-purpose charge-card story. Source: Diners Club corporate history; payment-card histories. Earlier merchant/charge instruments existed; first-ever-card language is too broad. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
