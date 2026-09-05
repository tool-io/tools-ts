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
          "Wholesale brokers can connect retail producers with specialty markets under specified licensing and appointment arrangements.",
        reference: "Insurance distribution literature.",
        limitations:
          "A market-access role does not establish coverage, competitive pricing or authority to bind.",
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
      text: "Wholesale brokers can connect retail producers with specialty markets under specified licensing and appointment arrangements.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/wholesale-broker-retail-producer-specialty-market-access-role",
  title: "Wholesale Broker Retail Producer Specialty Market Access Role",
  description:
    "Bounded offline reference: Wholesale brokers can connect retail producers with specialty markets under specified licensing and appointment arrangements. Source: Insurance distribution literature. A market-access role does not establish coverage, competitive pricing or authority to bind. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
