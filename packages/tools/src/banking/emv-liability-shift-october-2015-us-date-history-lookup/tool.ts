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
          "October 2015 is associated with a major US point-of-sale EMV counterfeit-fraud liability shift under card-network rules.",
        reference: "US Payments Forum, EMV liability-shift materials.",
        limitations:
          "Dates and exceptions differ by network/channel, including fuel dispensers; not liability for every fraud or a universal legal mandate.",
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
      text: "October 2015 is associated with a major US point-of-sale EMV counterfeit-fraud liability shift under card-network rules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/emv-liability-shift-october-2015-us-date-history-lookup",
  title: "Emv Liability Shift October 2015 Us Date History Lookup",
  description:
    "Bounded offline reference: October 2015 is associated with a major US point-of-sale EMV counterfeit-fraud liability shift under card-network rules. Source: US Payments Forum, EMV liability-shift materials. Dates and exceptions differ by network/channel, including fuel dispensers; not liability for every fraud or a universal legal mandate. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
