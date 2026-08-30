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
  readonly measuredReturnedFlux: readonly number[];
  readonly measuredIncidentFlux: readonly number[];
  readonly representedAngularWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly angularWeightedReturnEfficiency: number;
  readonly angularWeightedReturnedFlux: number;
}>;
const inputFields = [
  {
    id: "measuredReturnedFlux",
    label: "Measured returned flux",
    kind: "numberList",
  },
  {
    id: "measuredIncidentFlux",
    label: "Measured incident flux",
    kind: "numberList",
  },
  {
    id: "representedAngularWeights",
    label: "Represented angular weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredIncidentFlux.forEach((v) =>
    positive(v, "measuredIncidentFlux"),
  );
  input.representedAngularWeights.forEach((v) =>
    positive(v, "representedAngularWeights"),
  );
  input.measuredReturnedFlux.forEach((v) =>
    nonnegative(v, "measuredReturnedFlux"),
  );
  aligned(
    input.measuredReturnedFlux,
    input.measuredIncidentFlux,
    "measuredReturnedFlux",
  );
  aligned(
    input.measuredReturnedFlux,
    input.representedAngularWeights,
    "measuredReturnedFlux",
  );
  const angularWeightedReturnedFlux = input.measuredReturnedFlux.reduce(
      (s, v, i) => s + v * input.representedAngularWeights[i],
      0,
    ),
    incident = input.measuredIncidentFlux.reduce(
      (s, v, i) => s + v * input.representedAngularWeights[i],
      0,
    );
  return {
    angularWeightedReturnEfficiency: angularWeightedReturnedFlux / incident,
    angularWeightedReturnedFlux,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredReturnedFlux: [1, 2],
  measuredIncidentFlux: [2, 4],
  representedAngularWeights: [1, 2],
} satisfies Input;
export const exampleOutput = {
  angularWeightedReturnEfficiency: 0.5,
  angularWeightedReturnedFlux: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/brilliance-index",
  title: "Brilliance Index Approximation",
  description:
    "Aggregate independently measured returned/incident optical flux under stated matched angular exposures; no faceted ray-trace, perceptual brilliance grade or radiometric completeness inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "angularWeightedReturnEfficiency",
      label: "Angular weighted return efficiency",
      kind: "number",
    },
    {
      id: "angularWeightedReturnedFlux",
      label: "Angular weighted returned flux",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredReturnedFlux: value.measuredReturnedFlux as readonly number[],
      measuredIncidentFlux: value.measuredIncidentFlux as readonly number[],
      representedAngularWeights:
        value.representedAngularWeights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
