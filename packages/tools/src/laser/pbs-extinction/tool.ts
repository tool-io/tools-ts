import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transmittedSPower: number;
  readonly leakedPPower: number;
}>;
export type Output = Readonly<{
  readonly extinctionRatio: number;
  readonly extinctionDb: number;
  readonly leakageFraction: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.leakedPPower <= 0 ||
    input.transmittedSPower + input.leakedPPower <= 0
  )
    simpleError(
      "leakedPPower",
      "Leakage and total power must be positive.",
      "invalid_power",
    );
  const extinctionRatio = input.transmittedSPower / input.leakedPPower;
  return {
    extinctionRatio,
    extinctionDb: 10 * Math.log10(extinctionRatio),
    leakageFraction:
      input.leakedPPower / (input.transmittedSPower + input.leakedPPower),
  };
};

export const exampleInput = {
  transmittedSPower: 100,
  leakedPPower: 1,
} satisfies Input;
export const exampleOutput = {
  extinctionRatio: 100,
  extinctionDb: 20,
  leakageFraction: 0.009900990099009901,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transmittedSPower: input.transmittedSPower as number,
      leakedPPower: input.leakedPPower as number,
    }),
  description:
    "Calculate PBS extinction ratio, decibels, and leakage fraction.",
  id: "laser/pbs-extinction",
  inputs: [
    {
      id: "transmittedSPower",
      label: "Transmitted S-polarized power",
      kind: "number",
      minimum: 0,
    },
    {
      id: "leakedPPower",
      label: "Leaked P-polarized power",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "extinctionRatio",
      label: "S-to-P extinction ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "extinctionDb",
      label: "Extinction ratio",
      kind: "number",
      unit: "dB",
    },
    {
      id: "leakageFraction",
      label: "P leakage fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  title: "PBS Extinction",
});

export const run = tool.execute;
export default tool;
