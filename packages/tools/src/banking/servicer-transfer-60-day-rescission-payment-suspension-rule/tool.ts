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
          "US mortgage servicing-transfer rules include specified protection concerning certain timely payments sent to the prior servicer during 60 days after transfer.",
        reference: "12CFR1024.33(c).",
        limitations:
          "Not rescission, blanket payment suspension or forgiveness; applicability and payment routing require verified current guidance.",
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
      text: "US mortgage servicing-transfer rules include specified protection concerning certain timely payments sent to the prior servicer during 60 days after transfer.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/servicer-transfer-60-day-rescission-payment-suspension-rule",
  title: "Servicer Transfer60-Day Rescission Payment Suspension Rule",
  description:
    "Bounded offline reference: US mortgage servicing-transfer rules include specified protection concerning certain timely payments sent to the prior servicer during 60 days after transfer. Source: 12CFR1024.33(c). Not rescission, blanket payment suspension or forgiveness; applicability and payment routing require verified current guidance. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
