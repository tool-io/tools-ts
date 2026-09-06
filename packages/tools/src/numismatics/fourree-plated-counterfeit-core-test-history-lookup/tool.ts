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
          "Fourr\u00e9e refers to plated coins with a base-metal core, including ancient examples.",
        reference: "Ancient numismatic metallurgical scholarship.",
        limitations:
          "No destructive scratch/core test supplied; appearance or density alone does not authenticate a coin.",
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
      text: "Fourr\u00e9e refers to plated coins with a base-metal core, including ancient examples.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/fourree-plated-counterfeit-core-test-history-lookup",
  title: "Fourree Plated Counterfeit Core Test History Lookup",
  description:
    "Bounded offline reference: Fourr\u00e9e refers to plated coins with a base-metal core, including ancient examples. Source: Ancient numismatic metallurgical scholarship. No destructive scratch/core test supplied; appearance or density alone does not authenticate a coin. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
