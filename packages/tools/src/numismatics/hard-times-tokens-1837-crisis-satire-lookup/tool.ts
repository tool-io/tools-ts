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
          "Hard Times tokens include political/commercial copper pieces associated with the 1830 s\u20131840 seconomic context.",
        reference: "US Hard Times token catalogues.",
        limitations:
          "1837 is an important context, not the date or theme of every token; attribution requires exact variety.",
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
      text: "Hard Times tokens include political/commercial copper pieces associated with the 1830 s\u20131840 seconomic context.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/hard-times-tokens-1837-crisis-satire-lookup",
  title: "Hard Times Tokens 1837 Crisis Satire Lookup",
  description:
    "Bounded offline reference: Hard Times tokens include political/commercial copper pieces associated with the 1830 s\u20131840 seconomic context. Source: US Hard Times token catalogues. 1837 is an important context, not the date or theme of every token; attribution requires exact variety. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
