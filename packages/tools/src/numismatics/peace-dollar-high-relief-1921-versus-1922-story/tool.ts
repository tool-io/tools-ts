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
          "1921 Peace dollars used high relief;1922 circulation issues generally used reduced relief with rare high-relief experimental/proof contexts.",
        reference: "US Mint, Peace dollar histories.",
        limitations:
          "Do not infer every 1922 piece has identical relief or that relief alone authenticates it.",
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
      text: "1921 Peace dollars used high relief;1922 circulation issues generally used reduced relief with rare high-relief experimental/proof contexts.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/peace-dollar-high-relief-1921-versus-1922-story",
  title: "Peace Dollar High Relief 1921 Versus 1922 Story",
  description:
    "Bounded offline reference: 1921 Peace dollars used high relief;1922 circulation issues generally used reduced relief with rare high-relief experimental/proof contexts. Source: US Mint, Peace dollar histories. Do not infer every 1922 piece has identical relief or that relief alone authenticates it. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
