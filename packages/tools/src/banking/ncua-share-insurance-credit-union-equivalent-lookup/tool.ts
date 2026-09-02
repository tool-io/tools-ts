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
          "NCUA share insurance covers qualifying deposits at federally insured credit unions under ownership-category rules.",
        reference: "NCUA, share insurance consumer guidance.",
        limitations:
          "Not all institutions or assets are covered; current categories, aggregation and limits must be independently verified.",
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
      text: "NCUA share insurance covers qualifying deposits at federally insured credit unions under ownership-category rules.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/ncua-share-insurance-credit-union-equivalent-lookup",
  title: "NCUA Share Insurance Credit Union Equivalent Lookup",
  description:
    "Bounded offline reference: NCUA share insurance covers qualifying deposits at federally insured credit unions under ownership-category rules. Source: NCUA, share insurance consumer guidance. Not all institutions or assets are covered; current categories, aggregation and limits must be independently verified. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
