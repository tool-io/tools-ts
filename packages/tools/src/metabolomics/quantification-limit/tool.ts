import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly blankNoiseStdDev: number;
  readonly signalSlopePerUmol: number;
  readonly quantificationSnr: number;
}>;
export type Output = Readonly<{
  readonly limitUmol: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.blankNoiseStdDev <= 0 ||
    input.signalSlopePerUmol <= 0 ||
    input.quantificationSnr <= 0
  )
    simpleError(
      "signalSlopePerUmol",
      "Positive noise, calibration slope and S/N criterion required.",
    );
  return {
    limitUmol:
      (input.blankNoiseStdDev * input.quantificationSnr) /
      input.signalSlopePerUmol,
  };
};
export const exampleInput = {
  blankNoiseStdDev: 2,
  signalSlopePerUmol: 10,
  quantificationSnr: 10,
} satisfies Input;
export const exampleOutput = { limitUmol: 2 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/quantification-limit",
  title: "Quantification Limit",
  description:
    "Estimate concentration LOQ from calibration slope, blank noise, and a supplied S/N criterion.",
  inputs: [
    { id: "blankNoiseStdDev", kind: "number", label: "Blank noise std dev" },
    {
      id: "signalSlopePerUmol",
      kind: "number",
      label: "Signal slope per umol",
    },
    { id: "quantificationSnr", kind: "number", label: "Quantification snr" },
  ],
  outputs: [{ id: "limitUmol", kind: "number", label: "Limit umol" }],
  calculate: (value) =>
    calculate({
      blankNoiseStdDev: value.blankNoiseStdDev as number,
      signalSlopePerUmol: value.signalSlopePerUmol as number,
      quantificationSnr: value.quantificationSnr as number,
    }),
});
export const run = tool.execute;
export default tool;
