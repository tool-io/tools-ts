import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleSignals: readonly number[];
  readonly inputSignals: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedSignals: readonly number[];
  readonly correctedSignalTotal: number;
  readonly negativeCorrectedCount: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.sampleSignals.length;
  if (n === 0 || input.inputSignals.length !== n)
    simpleError(
      "sampleSignals",
      "Aligned nonempty signal lists are required.",
      "invalid_signals",
    );
  const correctedSignals = input.sampleSignals.map(
    (v, i) => v - input.inputSignals[i],
  );
  return {
    correctedSignals,
    correctedSignalTotal: correctedSignals.reduce((a, b) => a + b, 0),
    negativeCorrectedCount: correctedSignals.filter((v) => v < 0).length,
  };
};

export const exampleInput = {
  sampleSignals: [10, 20, 5],
  inputSignals: [2, 8, 7],
} satisfies Input;
export const exampleOutput = {
  correctedSignals: [8, 12, -2],
  correctedSignalTotal: 18,
  negativeCorrectedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sampleSignals: input.sampleSignals as readonly number[],
      inputSignals: input.inputSignals as readonly number[],
    }),
  description: "Subtract input background from epigenomic sample signals.",
  id: "epigenetics/input-background-correction",
  inputs: [
    { id: "sampleSignals", label: "Sample signals", kind: "numberList" },
    {
      id: "inputSignals",
      label: "Input background signals",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "correctedSignals",
      label: "Input-subtracted signals",
      kind: "numberList",
    },
    {
      id: "correctedSignalTotal",
      label: "Corrected signal total",
      kind: "number",
    },
    {
      id: "negativeCorrectedCount",
      label: "Negative corrected values",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Input Background Correction",
});

export const run = tool.execute;
export default tool;
