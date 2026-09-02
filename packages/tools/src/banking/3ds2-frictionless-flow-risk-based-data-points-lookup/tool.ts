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
          "EMV3DS2supports risk-based authentication with frictionless or challenge flows and transaction/device context.",
        reference: "EMV Co,3-D Secure specifications.",
        limitations:
          "A frictionless result is not zero fraud or proof of identity; no sensitive customer data required here.",
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
      text: "EMV3DS2supports risk-based authentication with frictionless or challenge flows and transaction/device context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/3ds2-frictionless-flow-risk-based-data-points-lookup",
  title: "3DS2 Frictionless Flow Risk Based Data Points Lookup",
  description:
    "Bounded offline reference: EMV3DS2supports risk-based authentication with frictionless or challenge flows and transaction/device context. Source: EMV Co,3-D Secure specifications. A frictionless result is not zero fraud or proof of identity; no sensitive customer data required here. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
