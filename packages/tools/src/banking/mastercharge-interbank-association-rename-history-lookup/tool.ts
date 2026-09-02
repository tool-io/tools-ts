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
          "The Interbank Card Association originated in 1966; Master Charge branding preceded the 1979 Mastercard name.",
        reference: "Mastercard corporate history.",
        limitations:
          "Corporate/network chronology is not current interchange, issuer liability or product policy.",
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
      text: "The Interbank Card Association originated in 1966; Master Charge branding preceded the 1979 Mastercard name.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/mastercharge-interbank-association-rename-history-lookup",
  title: "Mastercharge Interbank Association Rename History Lookup",
  description:
    "Bounded offline reference: The Interbank Card Association originated in 1966; Master Charge branding preceded the 1979 Mastercard name. Source: Mastercard corporate history. Corporate/network chronology is not current interchange, issuer liability or product policy. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
