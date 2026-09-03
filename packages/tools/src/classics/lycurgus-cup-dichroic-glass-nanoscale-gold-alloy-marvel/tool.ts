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
          "The Roman Lycurgus Cup has dichroic glass whose appearance differs in reflected/transmitted light, associated with dispersed gold/silver nanoparticles.",
        reference: "British Museum, Lycurgus Cup; glass-analysis research.",
        limitations:
          "Not a solid gold-alloy cup or proof ancient makers possessed modern nanotechnology theory.",
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
      text: "The Roman Lycurgus Cup has dichroic glass whose appearance differs in reflected/transmitted light, associated with dispersed gold/silver nanoparticles.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/lycurgus-cup-dichroic-glass-nanoscale-gold-alloy-marvel",
  title: "Lycurgus Cup Dichroic Glass Nanoscale Gold Alloy Marvel",
  description:
    "Bounded offline reference: The Roman Lycurgus Cup has dichroic glass whose appearance differs in reflected/transmitted light, associated with dispersed gold/silver nanoparticles. Source: British Museum, Lycurgus Cup; glass-analysis research. Not a solid gold-alloy cup or proof ancient makers possessed modern nanotechnology theory. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
