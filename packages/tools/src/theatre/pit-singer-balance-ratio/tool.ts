import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pitRmsPressurePascals: number;
  readonly singerRmsPressurePascals: number;
}>;
export type Output = Readonly<{
  readonly pressureRatio: number;
  readonly levelDifferenceDecibels: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.singerRmsPressurePascals <= 0 || input.pitRmsPressurePascals <= 0)
    simpleError(
      "singerRmsPressurePascals",
      "Both RMS pressures must be positive.",
      "invalid_pressure",
    );
  const pressureRatio =
    input.pitRmsPressurePascals / input.singerRmsPressurePascals;
  return {
    pressureRatio,
    levelDifferenceDecibels: 20 * Math.log10(pressureRatio),
  };
};

export const exampleInput = {
  pitRmsPressurePascals: 0.4,
  singerRmsPressurePascals: 0.5,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  pitRmsPressurePascals: 0.5,
  singerRmsPressurePascals: 0.5,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      pitRmsPressurePascals: input.pitRmsPressurePascals as number,
      singerRmsPressurePascals: input.singerRmsPressurePascals as number,
    }),
  description:
    "Calculate pit-to-singer RMS pressure ratio and relative decibel level.",
  id: "theatre/pit-singer-balance-ratio",
  inputs: [
    {
      id: "pitRmsPressurePascals",
      label: "Pit RMS sound pressure",
      kind: "number",
      minimum: 0,
      unit: "Pa",
    },
    {
      id: "singerRmsPressurePascals",
      label: "Singer RMS sound pressure",
      kind: "number",
      minimum: 0,
      unit: "Pa",
    },
  ],
  outputs: [
    {
      id: "pressureRatio",
      label: "Pit-to-singer pressure ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "levelDifferenceDecibels",
      label: "Pit minus singer level",
      kind: "number",
      unit: "dB",
    },
  ],
  title: "Pit-to-Singer Balance Ratio",
});

export const run = tool.execute;
export default tool;
