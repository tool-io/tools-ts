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
          "Repeated knock/entry-for-luck customs require performer, place and version-specific documentation.",
        reference: "Theatre and household folklore collections.",
        limitations:
          "The milestones two-runs wording is not assumed a universal established rule.",
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
      text: "Repeated knock/entry-for-luck customs require performer, place and version-specific documentation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/knock-knock-two-runs-it-for-luck-theater-entry-lookup",
  title: "Knock Knock Two Runs It For Luck Theater Entry Lookup",
  description:
    "Bounded offline reference: Repeated knock/entry-for-luck customs require performer, place and version-specific documentation. Source: Theatre and household folklore collections. The milestones two-runs wording is not assumed a universal established rule. Only explicitly listed topics are supported; no complete external catalog or live corpus implied.",
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
