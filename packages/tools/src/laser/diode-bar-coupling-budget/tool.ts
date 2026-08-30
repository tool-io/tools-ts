import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly stageEfficienciesPercent: readonly number[];
  readonly inputBrightness: number;
}>;
export type Output = Readonly<{
  readonly throughputPercent: number;
  readonly outputBrightness: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.stageEfficienciesPercent.length === 0 ||
    input.stageEfficienciesPercent.some((value) => value < 0 || value > 100)
  )
    simpleError(
      "stageEfficienciesPercent",
      "Efficiencies must be a nonempty list from zero to 100.",
      "invalid_efficiencies",
    );
  const throughputPercent =
    input.stageEfficienciesPercent.reduce(
      (product, value) => (product * value) / 100,
      1,
    ) * 100;
  return {
    throughputPercent,
    outputBrightness: (input.inputBrightness * throughputPercent) / 100,
  };
};

export const exampleInput = {
  stageEfficienciesPercent: [80, 90, 50],
  inputBrightness: 100,
} satisfies Input;
export const exampleOutput = {
  throughputPercent: 36,
  outputBrightness: 36,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      stageEfficienciesPercent:
        input.stageEfficienciesPercent as readonly number[],
      inputBrightness: input.inputBrightness as number,
    }),
  description:
    "Combine lenslet, alignment, and fiber-coupling efficiencies into a throughput budget.",
  id: "laser/diode-bar-coupling-budget",
  inputs: [
    {
      id: "stageEfficienciesPercent",
      label: "Coupling-stage efficiencies",
      kind: "numberList",
      unit: "%",
    },
    {
      id: "inputBrightness",
      label: "Input brightness",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "throughputPercent",
      label: "Total throughput",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "outputBrightness",
      label: "Output brightness",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Diode-Bar Coupling Budget",
});

export const run = tool.execute;
export default tool;
