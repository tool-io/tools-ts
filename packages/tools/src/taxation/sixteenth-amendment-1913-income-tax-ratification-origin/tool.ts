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
          "The Sixteenth Amendment was ratified in 1913 and addressed federal income taxation without apportionment among states.",
        reference: "US Constitution, AmendmentXVI; National Archives.",
        limitations:
          "Not the first-ever US income tax or authority to infer all receipts are taxable under every present rule.",
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
      text: "The Sixteenth Amendment was ratified in 1913 and addressed federal income taxation without apportionment among states.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/sixteenth-amendment-1913-income-tax-ratification-origin",
  title: "Sixteenth Amendment 1913 Income Tax Ratification Origin",
  description:
    "Bounded offline reference: The Sixteenth Amendment was ratified in 1913 and addressed federal income taxation without apportionment among states. Source: US Constitution, AmendmentXVI; National Archives. Not the first-ever US income tax or authority to infer all receipts are taxable under every present rule. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
