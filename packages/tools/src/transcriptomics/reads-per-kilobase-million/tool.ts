import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly readCounts: readonly number[];
  readonly geneLengthsBp: readonly number[];
  readonly mappedReads: number;
}>;
export type Output = Readonly<{
  readonly rpkm: readonly number[];
  readonly sumRpkm: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.readCounts.length;
  if (
    n === 0 ||
    input.geneLengthsBp.length !== n ||
    input.mappedReads <= 0 ||
    input.readCounts.some((v) => v < 0) ||
    input.geneLengthsBp.some((v) => v <= 0)
  )
    simpleError(
      "readCounts",
      "Aligned read counts, positive lengths and mapped reads required.",
    );
  const rpkm = input.readCounts.map(
    (v, i) => (v * 1e9) / (input.mappedReads * input.geneLengthsBp[i]),
  );
  return { rpkm, sumRpkm: rpkm.reduce((a, b) => a + b, 0) };
};
export const exampleInput = {
  readCounts: [10, 20],
  geneLengthsBp: [1000, 2000],
  mappedReads: 1000000,
} satisfies Input;
export const exampleOutput = { rpkm: [10, 10], sumRpkm: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/reads-per-kilobase-million",
  title: "Reads Per Kilobase Million",
  description: "Calculate reads per kilobase of gene per million mapped reads.",
  inputs: [
    { id: "readCounts", kind: "numberList", label: "Read counts" },
    { id: "geneLengthsBp", kind: "numberList", label: "Gene lengths bp" },
    { id: "mappedReads", kind: "number", label: "Mapped reads" },
  ],
  outputs: [
    { id: "rpkm", kind: "numberList", label: "Rpkm" },
    { id: "sumRpkm", kind: "number", label: "Sum rpkm" },
  ],
  calculate: (value) =>
    calculate({
      readCounts: value.readCounts as readonly number[],
      geneLengthsBp: value.geneLengthsBp as readonly number[],
      mappedReads: value.mappedReads as number,
    }),
});
export const run = tool.execute;
export default tool;
