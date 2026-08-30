import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly aliphaticIndex: number;
  readonly alanineFraction: number;
  readonly valineFraction: number;
  readonly ileLeuFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    frac = (aa: string) =>
      [...s].filter((v) => aa.includes(v)).length / s.length,
    alanineFraction = frac("A"),
    valineFraction = frac("V"),
    ileLeuFraction = frac("IL");
  return {
    aliphaticIndex:
      100 * (alanineFraction + 2.9 * valineFraction + 3.9 * ileLeuFraction),
    alanineFraction,
    valineFraction,
    ileLeuFraction,
  };
};
export const exampleInput = { sequence: "AVL" } satisfies Input;
export const exampleOutput = {
  aliphaticIndex: 259.99999999999994,
  alanineFraction: 0.3333333333333333,
  valineFraction: 0.3333333333333333,
  ileLeuFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-aliphatic-index",
  title: "Protein Aliphatic Index",
  description:
    "Calculate protein aliphatic index from Ala, Val, Ile, and Leu fractions.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "aliphaticIndex", label: "Aliphatic index", kind: "number" },
    { id: "alanineFraction", label: "Alanine fraction", kind: "number" },
    { id: "valineFraction", label: "Valine fraction", kind: "number" },
    { id: "ileLeuFraction", label: "Ile leu fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
