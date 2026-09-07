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
          "TCJA repealed the former section 199 domestic-production-activities deduction for specified post 2017 tax years.",
        reference: "US Public Law115-97; IRS, section 199 historical guidance.",
        limitations:
          "Legacy carryovers, specialized later provisions and effective dates need current authority; no present eligibility inferred.",
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
      text: "TCJA repealed the former section 199 domestic-production-activities deduction for specified post 2017 tax years.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/dpad-domestic-production-activities-repealed-2017-history-note",
  title: "DPAD Domestic Production Activities Repealed 2017 History Note",
  description:
    "Bounded offline reference: TCJA repealed the former section 199 domestic-production-activities deduction for specified post 2017 tax years. Source: US Public Law115-97; IRS, section 199 historical guidance. Legacy carryovers, specialized later provisions and effective dates need current authority; no present eligibility inferred. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
