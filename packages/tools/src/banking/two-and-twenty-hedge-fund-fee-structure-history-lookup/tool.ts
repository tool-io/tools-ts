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
          "Two and twenty commonly describes a2%management fee and20%performance allocation convention in hedge-fund discourse.",
        reference: "SEC, hedge-fund investor guidance.",
        limitations:
          "Actual bases, hurdles, high-water marks, expenses and timing vary; it is not a universal contract or return promise.",
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
      text: "Two and twenty commonly describes a2%management fee and20%performance allocation convention in hedge-fund discourse.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/two-and-twenty-hedge-fund-fee-structure-history-lookup",
  title: "Two and Twenty Hedge Fund Fee Structure History Lookup",
  description:
    "Bounded offline reference: Two and twenty commonly describes a2%management fee and20%performance allocation convention in hedge-fund discourse. Source: SEC, hedge-fund investor guidance. Actual bases, hurdles, high-water marks, expenses and timing vary; it is not a universal contract or return promise. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
