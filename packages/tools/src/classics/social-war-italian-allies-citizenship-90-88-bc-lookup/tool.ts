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
          "The Social War 90\u201388 BCE concerned Rome and Italian allies amid citizenship conflict and successive legal extensions.",
        reference:
          "Appian, Civil Wars1; Roman citizenship legislation scholarship.",
        limitations:
          "Eligibility and chronology vary; no timeless all-allies citizenship claim or current legal entitlement.",
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
      text: "The Social War 90\u201388 BCE concerned Rome and Italian allies amid citizenship conflict and successive legal extensions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/social-war-italian-allies-citizenship-90-88-bc-lookup",
  title: "Social War Italian Allies Citizenship90\u201388 BC Lookup",
  description:
    "Bounded offline reference: The Social War 90\u201388 BCE concerned Rome and Italian allies amid citizenship conflict and successive legal extensions. Source: Appian, Civil Wars1; Roman citizenship legislation scholarship. Eligibility and chronology vary; no timeless all-allies citizenship claim or current legal entitlement. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
