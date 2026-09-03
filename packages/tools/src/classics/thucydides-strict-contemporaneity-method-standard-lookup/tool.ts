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
          "Thucydides discusses critical handling of reports and reconstructing appropriate speeches while aiming at historical accuracy.",
        reference: "Thucydides 1.22.",
        limitations:
          "Methodological aspiration is not perfect neutrality, strict transcript preservation or proof every event was personally witnessed.",
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
      text: "Thucydides discusses critical handling of reports and reconstructing appropriate speeches while aiming at historical accuracy.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/thucydides-strict-contemporaneity-method-standard-lookup",
  title: "Thucydides Strict Contemporaneity Method Standard Lookup",
  description:
    "Bounded offline reference: Thucydides discusses critical handling of reports and reconstructing appropriate speeches while aiming at historical accuracy. Source: Thucydides 1.22. Methodological aspiration is not perfect neutrality, strict transcript preservation or proof every event was personally witnessed. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
