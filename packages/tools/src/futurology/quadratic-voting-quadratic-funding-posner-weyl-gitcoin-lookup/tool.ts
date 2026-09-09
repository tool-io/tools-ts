import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch46-shared.js";
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
          "Quadratic voting makes marginal votes increasingly costly; quadratic funding aggregates contribution breadth differently. Gitcoin is a particular implementation context.",
        reference:
          "Posnerand Weyl, Radical Markets 2018; Buterin, Hitzig, Weyl 2018.",
        limitations:
          "Distinct mechanisms, not Sybil resistance, universal fairness or current grant terms.",
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
      text: "Quadratic voting makes marginal votes increasingly costly; quadratic funding aggregates contribution breadth differently. Gitcoin is a particular implementation context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "futurology/quadratic-voting-quadratic-funding-posner-weyl-gitcoin-lookup",
  title: "Quadratic Voting Quadratic Funding Posner Weyl Gitcoin Lookup",
  description:
    "Bounded offline reference: Quadratic voting makes marginal votes increasingly costly; quadratic funding aggregates contribution breadth differently. Gitcoin is a particular implementation context. Source: Posnerand Weyl, Radical Markets 2018; Buterin, Hitzig, Weyl 2018. Distinct mechanisms, not Sybil resistance, universal fairness or current grant terms. Only explicit topic keys supported: summary, reference, limitations. No complete external corpus, live data or personal assessment implied.",
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
