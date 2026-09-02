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
          "Long-con investment scams can groom trust and show fabricated returns before requesting further transfers.",
        reference: "FBI, cryptocurrency-investment fraud guidance.",
        limitations:
          "Defensive recognition only; verify independently and report through trusted channels, not a scam execution playbook.",
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
      text: "Long-con investment scams can groom trust and show fabricated returns before requesting further transfers.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/pig-butchering-crypto-investment-long-con-playbook-lookup",
  title: "Pig Butchering Crypto Investment Long Con Playbook Lookup",
  description:
    "Bounded offline reference: Long-con investment scams can groom trust and show fabricated returns before requesting further transfers. Source: FBI, cryptocurrency-investment fraud guidance. Defensive recognition only; verify independently and report through trusted channels, not a scam execution playbook. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
