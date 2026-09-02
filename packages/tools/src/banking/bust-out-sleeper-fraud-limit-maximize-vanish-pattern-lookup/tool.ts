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
          "Bust-out fraud involves deliberate credit exploitation following apparently normal account activity in reported typologies.",
        reference: "FinCENand financial-industry fraud-risk materials.",
        limitations:
          "Defensive overview only, no limit-farming or evasion instructions; observed delinquency alone does not prove intent.",
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
      text: "Bust-out fraud involves deliberate credit exploitation following apparently normal account activity in reported typologies.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/bust-out-sleeper-fraud-limit-maximize-vanish-pattern-lookup",
  title: "Bust Out Sleeper Fraud Limit Maximize Vanish Pattern Lookup",
  description:
    "Bounded offline reference: Bust-out fraud involves deliberate credit exploitation following apparently normal account activity in reported typologies. Source: FinCENand financial-industry fraud-risk materials. Defensive overview only, no limit-farming or evasion instructions; observed delinquency alone does not prove intent. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
