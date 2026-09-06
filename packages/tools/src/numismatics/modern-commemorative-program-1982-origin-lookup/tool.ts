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
          "The 1982 George Washington commemorative half dollar is commonly treated as the beginning of the modern US commemorative program.",
        reference: "US Mint, modern commemorative program history.",
        limitations:
          "Program convention does not mean no intervening medal, special issue or commemorative elsewhere.",
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
      text: "The 1982 George Washington commemorative half dollar is commonly treated as the beginning of the modern US commemorative program.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/modern-commemorative-program-1982-origin-lookup",
  title: "Modern Commemorative Program 1982 Origin Lookup",
  description:
    "Bounded offline reference: The 1982 George Washington commemorative half dollar is commonly treated as the beginning of the modern US commemorative program. Source: US Mint, modern commemorative program history. Program convention does not mean no intervening medal, special issue or commemorative elsewhere. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
