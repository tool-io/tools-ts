import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly contextRadius: number;
}>;
export type Output = Readonly<{
  readonly lysineIndexes: readonly number[];
  readonly acidicNeighborCounts: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (!Number.isSafeInteger(input.contextRadius) || input.contextRadius < 0)
    simpleError(
      "contextRadius",
      "Nonnegative integer sequence context radius required.",
    );
  const lysineIndexes = [...s].flatMap((v, i) => (v === "K" ? [i] : [])),
    acidicNeighborCounts = lysineIndexes.map(
      (i) =>
        [
          ...s.slice(
            Math.max(0, i - input.contextRadius),
            Math.min(s.length, i + input.contextRadius + 1),
          ),
        ].filter((v) => v === "D" || v === "E").length,
    );
  return { lysineIndexes, acidicNeighborCounts };
};
export const exampleInput = {
  sequence: "AEKAA",
  contextRadius: 2,
} satisfies Input;
export const exampleOutput = {
  lysineIndexes: [2],
  acidicNeighborCounts: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/lysine-acetylation-context",
  title: "Lysine Acetylation Context",
  description:
    "Inspect lysine acetylation candidates and nearby acidic residues.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "contextRadius", label: "Context radius", kind: "number" },
  ],
  outputs: [
    { id: "lysineIndexes", label: "Lysine indexes", kind: "numberList" },
    {
      id: "acidicNeighborCounts",
      label: "Acidic neighbor counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      contextRadius: value.contextRadius as number,
    }),
});
export const run = tool.execute;
export default tool;
