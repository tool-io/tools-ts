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
          "Save More Tomorrow links commitments to later contribution increases; auto-enrollment is a related but distinct default design.",
        reference: "Thaler and Benartzi, Save More Tomorrow 2004.",
        limitations:
          "No universal participation boost or causal effect inferred without actual matched study design.",
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
      text: "Save More Tomorrow links commitments to later contribution increases; auto-enrollment is a related but distinct default design.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/auto-enrollment-save-more-tomorrow-nudge-participation-boost",
  title: "Auto Enrollment Save More Tomorrow Nudge Participation Boost",
  description:
    "Bounded offline reference: Save More Tomorrow links commitments to later contribution increases; auto-enrollment is a related but distinct default design. Source: Thaler and Benartzi, Save More Tomorrow 2004. No universal participation boost or causal effect inferred without actual matched study design. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
