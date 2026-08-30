import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly channelIntensities: readonly number[];
  readonly referenceChannelTotals: readonly number[];
}>;
export type Output = Readonly<{
  readonly normalizedIntensities: readonly number[];
  readonly factors: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.channelIntensities.length;
  if (
    n === 0 ||
    n !== input.referenceChannelTotals.length ||
    input.channelIntensities.some((v) => v <= 0) ||
    input.referenceChannelTotals.some((v) => v <= 0)
  )
    simpleError(
      "channelIntensities",
      "Aligned positive channel intensities and reference totals required.",
    );
  const factors = input.channelIntensities.map(
    (v, i) => input.referenceChannelTotals[i] / v,
  );
  return {
    normalizedIntensities: input.channelIntensities.map(
      (v, i) => v * factors[i],
    ),
    factors,
  };
};
export const exampleInput = {
  channelIntensities: [10, 20],
  referenceChannelTotals: [20, 20],
} satisfies Input;
export const exampleOutput = {
  normalizedIntensities: [20, 20],
  factors: [2, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/tmt-channel-normalization",
  title: "TMT Channel Normalization",
  description:
    "Equalize TMT reporter channels to caller-supplied reference totals.",
  inputs: [
    {
      id: "channelIntensities",
      label: "Channel intensities",
      kind: "numberList",
    },
    {
      id: "referenceChannelTotals",
      label: "Reference channel totals",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "normalizedIntensities",
      label: "Normalized intensities",
      kind: "numberList",
    },
    { id: "factors", label: "Factors", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      channelIntensities: value.channelIntensities as readonly number[],
      referenceChannelTotals: value.referenceChannelTotals as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
