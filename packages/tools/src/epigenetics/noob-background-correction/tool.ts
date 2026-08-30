import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly redSignals: readonly number[];
  readonly greenSignals: readonly number[];
  readonly redOutOfBand: readonly number[];
  readonly greenOutOfBand: readonly number[];
}>;
export type Output = Readonly<{
  readonly redCorrected: readonly number[];
  readonly greenCorrected: readonly number[];
  readonly redBackground: number;
  readonly greenBackground: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.redSignals.length === 0 ||
    input.redSignals.length !== input.greenSignals.length ||
    input.redOutOfBand.length === 0 ||
    input.greenOutOfBand.length === 0
  )
    simpleError(
      "redSignals",
      "Aligned signals and nonempty background controls are required.",
    );
  const mean = (v: readonly number[]) =>
      v.reduce((a, b) => a + b, 0) / v.length,
    redBackground = mean(input.redOutOfBand),
    greenBackground = mean(input.greenOutOfBand);
  return {
    redCorrected: input.redSignals.map((v) => Math.max(0, v - redBackground)),
    greenCorrected: input.greenSignals.map((v) =>
      Math.max(0, v - greenBackground),
    ),
    redBackground,
    greenBackground,
  };
};

export const exampleInput = {
  redSignals: [10, 20],
  greenSignals: [5, 15],
  redOutOfBand: [2, 4],
  greenOutOfBand: [1, 3],
} satisfies Input;
export const exampleOutput = {
  redCorrected: [7, 17],
  greenCorrected: [3, 13],
  redBackground: 3,
  greenBackground: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/noob-background-correction",
  title: "NOOB Background Correction",
  description:
    "Correct methylation-array dye channels using out-of-band control means.",
  inputs: [
    { id: "redSignals", kind: "numberList", label: "Red signals" },
    { id: "greenSignals", kind: "numberList", label: "Green signals" },
    { id: "redOutOfBand", kind: "numberList", label: "Red out of band" },
    { id: "greenOutOfBand", kind: "numberList", label: "Green out of band" },
  ],
  outputs: [
    { id: "redCorrected", kind: "numberList", label: "Red corrected" },
    { id: "greenCorrected", kind: "numberList", label: "Green corrected" },
    { id: "redBackground", kind: "number", label: "Red background" },
    { id: "greenBackground", kind: "number", label: "Green background" },
  ],
  calculate: (value) =>
    calculate({
      redSignals: value.redSignals as readonly number[],
      greenSignals: value.greenSignals as readonly number[],
      redOutOfBand: value.redOutOfBand as readonly number[],
      greenOutOfBand: value.greenOutOfBand as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
