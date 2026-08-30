import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, fraction, count, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly reciprocalDilutions: readonly number[];
  readonly plaqueCounts: readonly number[];
  readonly controlPlaques: number;
  readonly minimumReductionFraction: number;
}>;
export type Output = Readonly<{
  readonly reductionFractions: readonly number[];
  readonly endpointReciprocal: number;
  readonly endpointObserved: boolean;
  readonly rightCensored: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.reciprocalDilutions, input.plaqueCounts, "reciprocalDilutions");
  ordered(input.reciprocalDilutions, "reciprocalDilutions");
  input.reciprocalDilutions.forEach((v) => positive(v, "reciprocalDilutions"));
  input.plaqueCounts.forEach((v) => count(v, "plaqueCounts"));
  count(input.controlPlaques, "controlPlaques", 1);
  fraction(input.minimumReductionFraction, "minimumReductionFraction");
  if (input.plaqueCounts.some((v, i) => i > 0 && v < input.plaqueCounts[i - 1]))
    simpleError(
      "plaqueCounts",
      "Endpoint assay plaque counts must not decrease with reciprocal dilution.",
    );
  const reductionFractions = input.plaqueCounts.map(
    (v) => 1 - v / input.controlPlaques,
  );
  let index = -1;
  reductionFractions.forEach((v, i) => {
    if (v >= input.minimumReductionFraction) index = i;
  });
  return {
    reductionFractions,
    endpointReciprocal: index < 0 ? 0 : input.reciprocalDilutions[index],
    endpointObserved: index >= 0,
    rightCensored: index === input.reciprocalDilutions.length - 1,
  };
};
export const exampleInput = {
  reciprocalDilutions: [10, 20, 40, 80],
  plaqueCounts: [5, 10, 30, 60],
  controlPlaques: 100,
  minimumReductionFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  reductionFractions: [0.95, 0.9, 0.7, 0.4],
  endpointReciprocal: 20,
  endpointObserved: true,
  rightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/prnt-dilution-endpoint",
  title: "PRNT Dilution Endpoint",
  description:
    "Find the highest observed dilution meeting a supplied plaque-reduction criterion, preserving out-of-range censoring.",
  inputs: [
    {
      id: "reciprocalDilutions",
      label: "Reciprocal dilutions",
      kind: "numberList",
    },
    { id: "plaqueCounts", label: "Plaque counts", kind: "numberList" },
    {
      id: "controlPlaques",
      label: "Control plaques",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "minimumReductionFraction",
      label: "Minimum reduction fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "reductionFractions",
      label: "Reduction fractions",
      kind: "numberList",
    },
    { id: "endpointReciprocal", label: "Endpoint reciprocal", kind: "number" },
    { id: "endpointObserved", label: "Endpoint observed", kind: "boolean" },
    { id: "rightCensored", label: "Right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      reciprocalDilutions: value.reciprocalDilutions as readonly number[],
      plaqueCounts: value.plaqueCounts as readonly number[],
      controlPlaques: value.controlPlaques as number,
      minimumReductionFraction: value.minimumReductionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
