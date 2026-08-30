import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly motifPositions: readonly number[];
  readonly triadOrdered: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    motifPositions = [s.indexOf("VAIK"), s.indexOf("HRD"), s.indexOf("DFG")];
  return {
    motifPositions,
    triadOrdered:
      motifPositions[0] >= 0 &&
      motifPositions[1] > motifPositions[0] &&
      motifPositions[2] > motifPositions[1],
  };
};
export const exampleInput = { sequence: "VAIKAAHRDAADFG" } satisfies Input;
export const exampleOutput = {
  motifPositions: [0, 6, 11],
  triadOrdered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/kinase-motif-triad",
  title: "Kinase Motif Triad",
  description: "Audit the ordered VAIK, HRD, and DFG kinase-domain motifs.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "motifPositions", label: "Motif positions", kind: "numberList" },
    { id: "triadOrdered", label: "Triad ordered", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
