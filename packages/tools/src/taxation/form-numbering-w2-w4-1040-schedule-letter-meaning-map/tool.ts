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
    enum: ["W2", "W4", "F1040", "ScheduleA", "ScheduleC"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        W2: "W-2:employer wage and tax statement for applicable employee reporting.",
        W4: "W-4:employee withholding certificate under applicable instructions.",
        F1040: "1040:individual income tax return in the US federal system.",
        ScheduleA:
          "Schedule A:itemized deductions under that tax years instructions.",
        ScheduleC:
          "Schedule C:profit or loss from applicable sole-proprietor business activity.",
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
  input: { topic: "W2" },
  output: {
    result: {
      text: "W-2:employer wage and tax statement for applicable employee reporting.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/form-numbering-w2-w4-1040-schedule-letter-meaning-map",
  title: "Form Numbering W2 W4 1040 Schedule Letter Meaning Map",
  description:
    "Bounded offline reference: A bounded US form-purpose crosswalk explains common forms, not a universal decoding rule for form numbers. Source: IRS, Form W-2, W-4 and 1040instructions. Tax year and version determine actual requirements; the letters/numbers do not encode one universal statutory meaning. Supported topic keys: W2, W4, F1040, ScheduleA, ScheduleC. No complete external corpus or live policy implied.",
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
