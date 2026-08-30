import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly parallelReturn: number;
  readonly crossReturn: number;
}>;
export type Output = Readonly<{
  readonly depolarizationRatio: number;
  readonly crossPolarizedFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.parallelReturn <= 0)
    simpleError(
      "parallelReturn",
      "Parallel return must be positive.",
      "invalid_return",
    );
  const total = input.parallelReturn + input.crossReturn;
  return {
    depolarizationRatio: input.crossReturn / input.parallelReturn,
    crossPolarizedFraction: total === 0 ? 0 : input.crossReturn / total,
  };
};

export const exampleInput = {
  parallelReturn: 90,
  crossReturn: 10,
} satisfies Input;
export const exampleOutput = {
  depolarizationRatio: 0.1111111111111111,
  crossPolarizedFraction: 0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      parallelReturn: input.parallelReturn as number,
      crossReturn: input.crossReturn as number,
    }),
  description:
    "Calculate lidar depolarization ratio and cross-polarized return fraction.",
  id: "laser/lidar-polarization-ratio",
  inputs: [
    {
      id: "parallelReturn",
      label: "Parallel-polarized return",
      kind: "number",
      minimum: 0,
    },
    {
      id: "crossReturn",
      label: "Cross-polarized return",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "depolarizationRatio",
      label: "Cross-to-parallel depolarization ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "crossPolarizedFraction",
      label: "Cross-polarized fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "Lidar Polarization Ratio",
});

export const run = tool.execute;
export default tool;
