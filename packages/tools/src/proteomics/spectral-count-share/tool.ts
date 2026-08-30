import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly spectralCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly relativeAbundances: readonly number[];
  readonly totalSpectra: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.spectralCounts.length === 0 ||
    input.spectralCounts.some((v) => v < 0)
  )
    simpleError("spectralCounts", "Nonnegative spectral counts required.");
  const totalSpectra = input.spectralCounts.reduce((a, b) => a + b, 0);
  if (totalSpectra <= 0)
    simpleError("spectralCounts", "Total spectra must be positive.");
  return {
    relativeAbundances: input.spectralCounts.map((v) => v / totalSpectra),
    totalSpectra,
  };
};
export const exampleInput = { spectralCounts: [2, 3, 5] } satisfies Input;
export const exampleOutput = {
  relativeAbundances: [0.2, 0.3, 0.5],
  totalSpectra: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/spectral-count-share",
  title: "Spectral Count Share",
  description:
    "Normalize spectral counts to within-run protein abundance shares.",
  inputs: [
    { id: "spectralCounts", label: "Spectral counts", kind: "numberList" },
  ],
  outputs: [
    {
      id: "relativeAbundances",
      label: "Relative abundances",
      kind: "numberList",
    },
    { id: "totalSpectra", label: "Total spectra", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      spectralCounts: value.spectralCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
