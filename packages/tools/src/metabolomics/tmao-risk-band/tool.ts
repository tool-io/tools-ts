import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tmaoConcentrationUmolL: number;
  readonly lowBandCeiling: number;
  readonly highBandFloor: number;
}>;
export type Output = Readonly<{
  readonly riskBand: string;
  readonly distanceToHighBand: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.tmaoConcentrationUmolL < 0 ||
    input.lowBandCeiling < 0 ||
    input.lowBandCeiling > input.highBandFloor
  )
    simpleError(
      "lowBandCeiling",
      "Nonnegative and ordered band limits required.",
    );
  return {
    riskBand:
      input.tmaoConcentrationUmolL < input.lowBandCeiling
        ? "low"
        : input.tmaoConcentrationUmolL >= input.highBandFloor
          ? "high"
          : "middle",
    distanceToHighBand: input.highBandFloor - input.tmaoConcentrationUmolL,
  };
};
export const exampleInput = {
  tmaoConcentrationUmolL: 4,
  lowBandCeiling: 3,
  highBandFloor: 8,
} satisfies Input;
export const exampleOutput = {
  riskBand: "middle",
  distanceToHighBand: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/tmao-risk-band",
  title: "TMAO Risk Band",
  description:
    "Classify TMAO concentration against caller-supplied research bands, not a clinical diagnosis.",
  inputs: [
    {
      id: "tmaoConcentrationUmolL",
      kind: "number",
      label: "Tmao concentration umol l",
    },
    { id: "lowBandCeiling", kind: "number", label: "Low band ceiling" },
    { id: "highBandFloor", kind: "number", label: "High band floor" },
  ],
  outputs: [
    { id: "riskBand", kind: "string", label: "Risk band" },
    {
      id: "distanceToHighBand",
      kind: "number",
      label: "Distance to high band",
    },
  ],
  calculate: (value) =>
    calculate({
      tmaoConcentrationUmolL: value.tmaoConcentrationUmolL as number,
      lowBandCeiling: value.lowBandCeiling as number,
      highBandFloor: value.highBandFloor as number,
    }),
});
export const run = tool.execute;
export default tool;
