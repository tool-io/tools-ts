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
          "The 1791 federal distilled-spirits excise led to resistance including the 1794 Whiskey Rebellion and federal enforcement.",
        reference: "US National Archives; early federal revenue histories.",
        limitations:
          "First domestic crisis is an interpretive label, not a complete ranking of all prior disputes or present excise liability.",
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
      text: "The 1791 federal distilled-spirits excise led to resistance including the 1794 Whiskey Rebellion and federal enforcement.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/whiskey-rebellion-1791-excise-first-domestic-crisis-history",
  title: "Whiskey Rebellion 1791 Excise First Domestic Crisis History",
  description:
    "Bounded offline reference: The 1791 federal distilled-spirits excise led to resistance including the 1794 Whiskey Rebellion and federal enforcement. Source: US National Archives; early federal revenue histories. First domestic crisis is an interpretive label, not a complete ranking of all prior disputes or present excise liability. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
