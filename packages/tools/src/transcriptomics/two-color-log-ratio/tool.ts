import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cy5: readonly number[];
  readonly cy3: readonly number[];
  readonly pseudocount: number;
}>;
export type Output = Readonly<{
  readonly log2Ratios: readonly number[];
  readonly meanLog2Ratio: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cy5.length === 0 ||
    input.cy5.length !== input.cy3.length ||
    input.pseudocount < 0
  )
    simpleError(
      "cy5",
      "Aligned dye signals and nonnegative pseudocount are required.",
    );
  const log2Ratios = input.cy5.map((v, i) => {
    if (v + input.pseudocount <= 0 || input.cy3[i] + input.pseudocount <= 0)
      simpleError("cy5", "Dye intensities must have positive adjusted values.");
    return Math.log2(
      (v + input.pseudocount) / (input.cy3[i] + input.pseudocount),
    );
  });
  return {
    log2Ratios,
    meanLog2Ratio: log2Ratios.reduce((a, b) => a + b, 0) / log2Ratios.length,
  };
};

export const exampleInput = {
  cy5: [8, 16],
  cy3: [4, 4],
  pseudocount: 0,
} satisfies Input;
export const exampleOutput = {
  log2Ratios: [1, 2],
  meanLog2Ratio: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/two-color-log-ratio",
  title: "Two Color Log Ratio",
  description: "Compute log2 Cy5/Cy3 spot ratios with an optional pseudocount.",
  inputs: [
    { id: "cy5", kind: "numberList", label: "Cy 5" },
    { id: "cy3", kind: "numberList", label: "Cy 3" },
    { id: "pseudocount", kind: "number", label: "Pseudocount" },
  ],
  outputs: [
    { id: "log2Ratios", kind: "numberList", label: "Log 2 ratios" },
    { id: "meanLog2Ratio", kind: "number", label: "Mean log 2 ratio" },
  ],
  calculate: (value) =>
    calculate({
      cy5: value.cy5 as readonly number[],
      cy3: value.cy3 as readonly number[],
      pseudocount: value.pseudocount as number,
    }),
});
export const run = tool.execute;
export default tool;
