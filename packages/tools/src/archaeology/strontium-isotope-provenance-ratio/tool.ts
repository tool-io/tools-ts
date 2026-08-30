import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleSr87Sr86Ratio: number;
  readonly sampleSigma: number;
  readonly sourceMeanRatios: readonly number[];
  readonly sourceSigmas: readonly number[];
  readonly callerAbsoluteZLimit: number;
}>;
export type Output = Readonly<{
  readonly sourceStandardizedDifferences: readonly number[];
  readonly compatibleSourceFlags: readonly number[];
  readonly compatibleSourceCount: number;
}>;
const inputFields = [
  {
    id: "sampleSr87Sr86Ratio",
    label: "Sample sr87 sr86 ratio",
    kind: "number",
  },
  { id: "sampleSigma", label: "Sample sigma", kind: "number" },
  { id: "sourceMeanRatios", label: "Source mean ratios", kind: "numberList" },
  { id: "sourceSigmas", label: "Source sigmas", kind: "numberList" },
  {
    id: "callerAbsoluteZLimit",
    label: "Caller absolute z limit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.sampleSr87Sr86Ratio, "sampleSr87Sr86Ratio");
  input.sourceMeanRatios.forEach((v) => positive(v, "sourceMeanRatios"));
  positive(input.callerAbsoluteZLimit, "callerAbsoluteZLimit");
  nonnegative(input.sampleSigma, "sampleSigma");
  input.sourceSigmas.forEach((v) => nonnegative(v, "sourceSigmas"));
  aligned(input.sourceMeanRatios, input.sourceSigmas, "sourceMeanRatios");
  const sourceStandardizedDifferences = input.sourceMeanRatios.map(
      (v, i) =>
        (input.sampleSr87Sr86Ratio - v) /
        positive(
          Math.hypot(input.sampleSigma, input.sourceSigmas[i]),
          "sourceSigmas",
        ),
    ),
    compatibleSourceFlags = sourceStandardizedDifferences.map((z) =>
      Math.abs(z) <= input.callerAbsoluteZLimit ? 1 : 0,
    );
  return {
    sourceStandardizedDifferences,
    compatibleSourceFlags,
    compatibleSourceCount: compatibleSourceFlags.reduce<number>(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleSr87Sr86Ratio: 0.71,
  sampleSigma: 0.001,
  sourceMeanRatios: [0.71, 0.714],
  sourceSigmas: [0.001, 0.001],
  callerAbsoluteZLimit: 2,
} satisfies Input;
export const exampleOutput = {
  sourceStandardizedDifferences: [0, -2.8284271247461903],
  compatibleSourceFlags: [1, 0],
  compatibleSourceCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/strontium-isotope-provenance-ratio",
  title: "Strontium Isotope Provenance Ratio Tool",
  description:
    "Compare measured strontium ratio to all caller source baselines with independent sigma, retaining overlap and no matches; no ratio aliases, geographic identification or forced provenance.",
  inputs: inputFields,
  outputs: [
    {
      id: "sourceStandardizedDifferences",
      label: "Source standardized differences",
      kind: "numberList",
    },
    {
      id: "compatibleSourceFlags",
      label: "Compatible source flags",
      kind: "numberList",
    },
    {
      id: "compatibleSourceCount",
      label: "Compatible source count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleSr87Sr86Ratio: value.sampleSr87Sr86Ratio as number,
      sampleSigma: value.sampleSigma as number,
      sourceMeanRatios: value.sourceMeanRatios as readonly number[],
      sourceSigmas: value.sourceSigmas as readonly number[],
      callerAbsoluteZLimit: value.callerAbsoluteZLimit as number,
    }),
});
export const run = tool.execute;
export default tool;
