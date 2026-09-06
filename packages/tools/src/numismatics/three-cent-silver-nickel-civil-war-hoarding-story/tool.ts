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
          "Three-cent silver began in 1851; three-cent nickel began in 1865 within changing small-change circulation conditions.",
        reference: "US Mint, three-cent coin histories.",
        limitations:
          "Civil-War hoarding is context, not the only cause or proof every issue was minted solely for hoarding relief.",
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
      text: "Three-cent silver began in 1851; three-cent nickel began in 1865 within changing small-change circulation conditions.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/three-cent-silver-nickel-civil-war-hoarding-story",
  title: "Three Cent Silver Nickel Civil War Hoarding Story",
  description:
    "Bounded offline reference: Three-cent silver began in 1851; three-cent nickel began in 1865 within changing small-change circulation conditions. Source: US Mint, three-cent coin histories. Civil-War hoarding is context, not the only cause or proof every issue was minted solely for hoarding relief. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
