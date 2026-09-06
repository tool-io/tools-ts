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
          "Overmintmarks involve differing mintmark punches; hub doubling involves a distinct die-making mechanism.",
        reference: "Die-variety catalogue scholarship.",
        limitations:
          "The milestones O\u043c\u043d/OMN wording is not adopted as a universal code; distinguish OMM from doubled die and machine doubling.",
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
      text: "Overmintmarks involve differing mintmark punches; hub doubling involves a distinct die-making mechanism.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/overmintmark-omn-hub-doubling-history-lookup",
  title: "Overmintmark Omn Hub Doubling History Lookup",
  description:
    "Bounded offline reference: Overmintmarks involve differing mintmark punches; hub doubling involves a distinct die-making mechanism. Source: Die-variety catalogue scholarship. The milestones O\u043c\u043d/OMN wording is not adopted as a universal code; distinguish OMM from doubled die and machine doubling. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
