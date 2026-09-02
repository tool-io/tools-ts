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
          "Request for payment is a message asking for payment; a credit push is the payer-initiated transfer instruction in a particular scheme.",
        reference: "Payment-system request-for-payment documentation.",
        limitations:
          "A request is not proof that a transfer has happened; consent, message authentication and scheme rules matter.",
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
      text: "Request for payment is a message asking for payment; a credit push is the payer-initiated transfer instruction in a particular scheme.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/rfp-request-for-payment-versus-credit-push-direction-lookup",
  title: "RFP Request For Payment Versus Credit Push Direction Lookup",
  description:
    "Bounded offline reference: Request for payment is a message asking for payment; a credit push is the payer-initiated transfer instruction in a particular scheme. Source: Payment-system request-for-payment documentation. A request is not proof that a transfer has happened; consent, message authentication and scheme rules matter. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
