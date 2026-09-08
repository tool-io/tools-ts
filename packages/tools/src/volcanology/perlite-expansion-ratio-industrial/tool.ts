import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedPerlitePreExpansionVolumesMl: readonly number[];
  readonly observedMatchedExpandedVolumesMl: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPerliteExpansionRatios: readonly number[];
  readonly pooledPerliteExpansionRatio: number;
}>;
const inputFields = [
  {
    id: "observedPerlitePreExpansionVolumesMl",
    label: "Observed perlite pre expansion volumes ml",
    kind: "numberList",
  },
  {
    id: "observedMatchedExpandedVolumesMl",
    label: "Observed matched expanded volumes ml",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPerlitePreExpansionVolumesMl.forEach((v) =>
    positive(v, "observedPerlitePreExpansionVolumesMl"),
  );
  input.observedMatchedExpandedVolumesMl.forEach((v) =>
    nonnegative(v, "observedMatchedExpandedVolumesMl"),
  );
  aligned(
    input.observedPerlitePreExpansionVolumesMl,
    input.observedMatchedExpandedVolumesMl,
    "observedPerlitePreExpansionVolumesMl",
  );
  return {
    observedPerliteExpansionRatios: input.observedMatchedExpandedVolumesMl.map(
      (v, i) => v / input.observedPerlitePreExpansionVolumesMl[i],
    ),
    pooledPerliteExpansionRatio:
      sum(input.observedMatchedExpandedVolumesMl) /
      sum(input.observedPerlitePreExpansionVolumesMl),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPerlitePreExpansionVolumesMl: [10, 20],
  observedMatchedExpandedVolumesMl: [100, 300],
} satisfies Input;
export const exampleOutput = {
  observedPerliteExpansionRatios: [10, 15],
  pooledPerliteExpansionRatio: 13.333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/perlite-expansion-ratio-industrial",
  title: "Perlite Expansion Ratio Industrial Lookup",
  description:
    "Actual matched perlite test expansion volumes and pre-volume weighted pooled ratio, no industrial temperature/processing instructions or fabricated grade table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPerliteExpansionRatios",
      label: "Observed perlite expansion ratios",
      kind: "numberList",
    },
    {
      id: "pooledPerliteExpansionRatio",
      label: "Pooled perlite expansion ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPerlitePreExpansionVolumesMl:
        value.observedPerlitePreExpansionVolumesMl as readonly number[],
      observedMatchedExpandedVolumesMl:
        value.observedMatchedExpandedVolumesMl as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
