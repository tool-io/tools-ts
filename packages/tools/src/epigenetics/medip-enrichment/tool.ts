import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly immunoprecipitateSignal: number;
  readonly inputSignal: number;
  readonly ipVolumeFraction: number;
  readonly inputVolumeFraction: number;
}>;
export type Output = Readonly<{
  readonly normalizedIpSignal: number;
  readonly normalizedInputSignal: number;
  readonly enrichmentFold: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.ipVolumeFraction <= 0 ||
    input.inputVolumeFraction <= 0 ||
    input.inputSignal <= 0
  )
    simpleError(
      "inputSignal",
      "Signals and volume fractions must be positive.",
      "invalid_signal",
    );
  const normalizedIpSignal =
      input.immunoprecipitateSignal / input.ipVolumeFraction,
    normalizedInputSignal = input.inputSignal / input.inputVolumeFraction;
  return {
    normalizedIpSignal,
    normalizedInputSignal,
    enrichmentFold: normalizedIpSignal / normalizedInputSignal,
  };
};

export const exampleInput = {
  immunoprecipitateSignal: 200,
  inputSignal: 100,
  ipVolumeFraction: 0.5,
  inputVolumeFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  normalizedIpSignal: 400,
  normalizedInputSignal: 400,
  enrichmentFold: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      immunoprecipitateSignal: input.immunoprecipitateSignal as number,
      inputSignal: input.inputSignal as number,
      ipVolumeFraction: input.ipVolumeFraction as number,
      inputVolumeFraction: input.inputVolumeFraction as number,
    }),
  description: "Calculate MeDIP enrichment after volume normalization.",
  id: "epigenetics/medip-enrichment",
  inputs: [
    {
      id: "immunoprecipitateSignal",
      label: "MeDIP immunoprecipitate signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "inputSignal",
      label: "Input DNA signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "ipVolumeFraction",
      label: "Immunoprecipitate volume fraction",
      kind: "number",
      minimum: 0,
    },
    {
      id: "inputVolumeFraction",
      label: "Input volume fraction",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "normalizedIpSignal",
      label: "Normalized IP signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "normalizedInputSignal",
      label: "Normalized input signal",
      kind: "number",
      minimum: 0,
    },
    {
      id: "enrichmentFold",
      label: "MeDIP enrichment fold",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "MeDIP Enrichment",
});

export const run = tool.execute;
export default tool;
