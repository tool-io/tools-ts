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
          "The familiar Maria Theresa thaler carries an 1780 date on many later restrikes.",
        reference:
          "Austrian Mint, Maria Theresa thaler history/specifications.",
        limitations:
          "An 1780 legend does not prove minting in 1780; verify issue-specific measurements and restrike attribution.",
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
      text: "The familiar Maria Theresa thaler carries an 1780 date on many later restrikes.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/maria-theresa-thaler-specs-lookup",
  title: "Maria Theresa Thaler Specs Lookup",
  description:
    "Bounded offline reference: The familiar Maria Theresa thaler carries an 1780 date on many later restrikes. Source: Austrian Mint, Maria Theresa thaler history/specifications. An 1780 legend does not prove minting in 1780; verify issue-specific measurements and restrike attribution. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
