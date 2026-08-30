import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly methylatedSignal: number;
  readonly unmethylatedSignal: number;
  readonly backgroundSignal: number;
}>;
export type Output = Readonly<{
  readonly correctedMethylatedSignal: number;
  readonly correctedUnmethylatedSignal: number;
  readonly methylationPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const correctedMethylatedSignal = Math.max(
      0,
      input.methylatedSignal - input.backgroundSignal,
    ),
    correctedUnmethylatedSignal = Math.max(
      0,
      input.unmethylatedSignal - input.backgroundSignal,
    ),
    total = correctedMethylatedSignal + correctedUnmethylatedSignal;
  if (total <= 0)
    simpleError(
      "methylatedSignal",
      "Corrected total signal must be positive.",
      "zero_signal",
    );
  return {
    correctedMethylatedSignal,
    correctedUnmethylatedSignal,
    methylationPercent: (correctedMethylatedSignal / total) * 100,
  };
};

export const exampleInput = {
  methylatedSignal: 80,
  unmethylatedSignal: 30,
  backgroundSignal: 5,
} satisfies Input;
export const exampleOutput = {
  correctedMethylatedSignal: 75,
  correctedUnmethylatedSignal: 25,
  methylationPercent: 75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      methylatedSignal: input.methylatedSignal as number,
      unmethylatedSignal: input.unmethylatedSignal as number,
      backgroundSignal: input.backgroundSignal as number,
    }),
  description: "Calculate single-CpG methylation after background correction.",
  id: "epigenetics/single-cpg-methylation",
  inputs: [
    {
      id: "methylatedSignal",
      label: "Methylated signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "unmethylatedSignal",
      label: "Unmethylated signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "backgroundSignal",
      label: "Background signal",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "correctedMethylatedSignal",
      label: "Corrected methylated signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "correctedUnmethylatedSignal",
      label: "Corrected unmethylated signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "methylationPercent",
      label: "Single-CpG methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Single-CpG Methylation",
});

export const run = tool.execute;
export default tool;
