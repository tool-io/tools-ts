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
          "British crown silver content depends on issue/era, including sterling, lower-fineness and non-silver issues.",
        reference: "Royal Mint, crown coinage histories.",
        limitations:
          "A denomination alone does not establish mass, fineness or bullion value.",
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
      text: "British crown silver content depends on issue/era, including sterling, lower-fineness and non-silver issues.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/crown-denomination-silver-content-lookup",
  title: "Crown Denomination Silver Content Lookup",
  description:
    "Bounded offline reference: British crown silver content depends on issue/era, including sterling, lower-fineness and non-silver issues. Source: Royal Mint, crown coinage histories. A denomination alone does not establish mass, fineness or bullion value. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
