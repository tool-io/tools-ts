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
          "The 1907 panic involved private coordination associated with J. P. Morgan amid trust-company and liquidity stresses.",
        reference: "Federal Reserve History, Panic of 1907.",
        limitations:
          "The lockup-room story is an anecdotal layer, not a complete causal explanation or contemporary intervention guide.",
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
      text: "The 1907 panic involved private coordination associated with J. P. Morgan amid trust-company and liquidity stresses.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/panic-1907-jp-morgan-lockup-room-intervention-history",
  title: "Panic 1907 Jp Morgan Lockup Room Intervention History",
  description:
    "Bounded offline reference: The 1907 panic involved private coordination associated with J. P. Morgan amid trust-company and liquidity stresses. Source: Federal Reserve History, Panic of 1907. The lockup-room story is an anecdotal layer, not a complete causal explanation or contemporary intervention guide. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
