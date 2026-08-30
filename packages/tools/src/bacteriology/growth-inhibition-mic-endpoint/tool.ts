import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { endpoints } from "../shared.js";

export type Input = Readonly<{
  readonly concentrations: readonly number[];
  readonly growthFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly micConcentration: number;
  readonly endpointFound: boolean;
  readonly leftCensored: boolean;
  readonly rightCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  endpoints(input.concentrations, input.growthFlags, "concentrations");
  if (
    input.growthFlags.some(
      (v, i) => (v !== 0 && v !== 1) || (i > 0 && v > input.growthFlags[i - 1]),
    )
  )
    simpleError(
      "growthFlags",
      "Binary nonincreasing growth observations required.",
    );
  const index = input.growthFlags.indexOf(0);
  return {
    micConcentration: index < 0 ? 0 : input.concentrations[index],
    endpointFound: index >= 0,
    leftCensored: index === 0,
    rightCensored: index < 0,
  };
};
export const exampleInput = {
  concentrations: [1, 2, 4, 8],
  growthFlags: [1, 1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  micConcentration: 4,
  endpointFound: true,
  leftCensored: false,
  rightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/growth-inhibition-mic-endpoint",
  title: "Growth Inhibition MIC Endpoint",
  description:
    "Derive the observed MIC from a monotone dilution-growth series, preserving below- and above-range censoring.",
  inputs: [
    { id: "concentrations", label: "Concentrations", kind: "numberList" },
    { id: "growthFlags", label: "Growth flags", kind: "numberList" },
  ],
  outputs: [
    { id: "micConcentration", label: "Mic concentration", kind: "number" },
    { id: "endpointFound", label: "Endpoint found", kind: "boolean" },
    { id: "leftCensored", label: "Left censored", kind: "boolean" },
    { id: "rightCensored", label: "Right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      concentrations: value.concentrations as readonly number[],
      growthFlags: value.growthFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
