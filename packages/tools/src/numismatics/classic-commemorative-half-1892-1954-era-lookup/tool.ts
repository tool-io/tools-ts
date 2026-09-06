import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick, bounded } from "../batch45-shared.js";
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
          "US classic commemorative half-dollar issues conventionally span 1892\u20131954 in the collector category.",
        reference: "US Mint, commemorative coin histories.",
        limitations:
          "A bounded half-dollar category, not every commemorative denomination or every year represented.",
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
      text: "US classic commemorative half-dollar issues conventionally span 1892\u20131954 in the collector category.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/classic-commemorative-half-1892-1954-era-lookup",
  title: "Classic Commemorative Half 1892\u20131954 Era Lookup",
  description:
    "Bounded offline reference: US classic commemorative half-dollar issues conventionally span 1892\u20131954 in the collector category. Source: US Mint, commemorative coin histories. A bounded half-dollar category, not every commemorative denomination or every year represented. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
