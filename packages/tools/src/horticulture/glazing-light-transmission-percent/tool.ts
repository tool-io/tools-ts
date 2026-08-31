import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly pairedOutsidePpfd: readonly number[];
  readonly pairedInsidePpfd: readonly number[];
  readonly representedExposureWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTransmissionFractions: readonly number[];
  readonly exposureWeightedTransmissionFraction: number;
}>;
const inputFields = [
  { id: "pairedOutsidePpfd", label: "Paired outside ppfd", kind: "numberList" },
  { id: "pairedInsidePpfd", label: "Paired inside ppfd", kind: "numberList" },
  {
    id: "representedExposureWeights",
    label: "Represented exposure weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.pairedOutsidePpfd.forEach((v) => positive(v, "pairedOutsidePpfd"));
  input.representedExposureWeights.forEach((v) =>
    positive(v, "representedExposureWeights"),
  );
  input.pairedInsidePpfd.forEach((v) => nonnegative(v, "pairedInsidePpfd"));
  aligned(input.pairedOutsidePpfd, input.pairedInsidePpfd, "pairedOutsidePpfd");
  aligned(
    input.pairedOutsidePpfd,
    input.representedExposureWeights,
    "pairedOutsidePpfd",
  );
  const transmitted = input.pairedInsidePpfd.map(
      (v, i) => v / input.pairedOutsidePpfd[i],
    ),
    w = weights(
      input.representedExposureWeights.map(
        (v, i) => v * input.pairedOutsidePpfd[i],
      ),
    );
  return {
    observedTransmissionFractions: transmitted,
    exposureWeightedTransmissionFraction: sum(
      transmitted.map((v, i) => v * w[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pairedOutsidePpfd: [100, 200],
  pairedInsidePpfd: [60, 100],
  representedExposureWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedTransmissionFractions: [0.6, 0.5],
  exposureWeightedTransmissionFraction: 0.52,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/glazing-light-transmission-percent",
  title: "Glazing Light Transmission Percent Calculator",
  description:
    "Audit actual paired glazing photon observations pooled by incident photon exposure; ratios >1 remain mismatched/reflection evidence, not clipped or equal-sample transmission mean.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTransmissionFractions",
      label: "Observed transmission fractions",
      kind: "numberList",
    },
    {
      id: "exposureWeightedTransmissionFraction",
      label: "Exposure weighted transmission fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pairedOutsidePpfd: value.pairedOutsidePpfd as readonly number[],
      pairedInsidePpfd: value.pairedInsidePpfd as readonly number[],
      representedExposureWeights:
        value.representedExposureWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
