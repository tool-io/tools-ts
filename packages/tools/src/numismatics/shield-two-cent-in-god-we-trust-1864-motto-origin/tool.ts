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
          "The US 1864 two-cent piece introduced In God We Trust on circulating US coinage.",
        reference: "US Mint, two-cent piece history.",
        limitations:
          "Not the first religious phrase on every world coin or proof of a modern legal requirement on each coin.",
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
      text: "The US 1864 two-cent piece introduced In God We Trust on circulating US coinage.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/shield-two-cent-in-god-we-trust-1864-motto-origin",
  title: "Shield Two Cent in God We Trust 1864 Motto Origin",
  description:
    "Bounded offline reference: The US 1864 two-cent piece introduced In God We Trust on circulating US coinage. Source: US Mint, two-cent piece history. Not the first religious phrase on every world coin or proof of a modern legal requirement on each coin. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
