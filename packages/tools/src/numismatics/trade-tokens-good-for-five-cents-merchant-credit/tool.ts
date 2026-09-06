import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, money } from "../batch45-shared.js";
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
          "Good-for trade tokens can represent issuer-specific credit or exchange claims under local conditions.",
        reference: "Merchant-token catalogues and commercial histories.",
        limitations:
          "A five-cent legend is not a current enforceable universal money claim or metal value.",
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
      text: "Good-for trade tokens can represent issuer-specific credit or exchange claims under local conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/trade-tokens-good-for-five-cents-merchant-credit",
  title: "Trade Tokens Good For Five Cents Merchant Credit",
  description:
    "Bounded offline reference: Good-for trade tokens can represent issuer-specific credit or exchange claims under local conditions. Source: Merchant-token catalogues and commercial histories. A five-cent legend is not a current enforceable universal money claim or metal value. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
