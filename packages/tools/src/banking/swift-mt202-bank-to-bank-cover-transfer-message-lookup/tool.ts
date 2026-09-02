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
          "MT202 is a financial-institution transfer message; MT202COVis a distinct cover-payment form carrying underlying customer-transfer information.",
        reference: "SWIFT, MT202/MT202COVstandards.",
        limitations:
          "Do not conflate the two or treat a message as proof of settlement, legitimacy or an irrevocable payment.",
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
      text: "MT202 is a financial-institution transfer message; MT202COVis a distinct cover-payment form carrying underlying customer-transfer information.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/swift-mt202-bank-to-bank-cover-transfer-message-lookup",
  title: "SWIFT MT202 Bank to Bank Cover Transfer Message Lookup",
  description:
    "Bounded offline reference: MT202 is a financial-institution transfer message; MT202COVis a distinct cover-payment form carrying underlying customer-transfer information. Source: SWIFT, MT202/MT202COVstandards. Do not conflate the two or treat a message as proof of settlement, legitimacy or an irrevocable payment. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
