import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  unique,
  strictlyIncreasing,
  linearFit,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPhotonEnergyEv: readonly number[];
  readonly observedSquaredDirectTaucResponse: readonly number[];
  readonly callerSelectedFitIndices: readonly number[];
}>;
export type Output = Readonly<{
  readonly measuredDirectTaucGapEv: number;
  readonly selectedTaucFitRSquared: number;
}>;
const inputFields = [
  {
    id: "observedPhotonEnergyEv",
    label: "Observed photon energy ev",
    kind: "numberList",
  },
  {
    id: "observedSquaredDirectTaucResponse",
    label: "Observed squared direct tauc response",
    kind: "numberList",
  },
  {
    id: "callerSelectedFitIndices",
    label: "Caller selected fit indices",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPhotonEnergyEv.forEach((v) =>
    positive(v, "observedPhotonEnergyEv"),
  );
  input.observedSquaredDirectTaucResponse.forEach((v) =>
    nonnegative(v, "observedSquaredDirectTaucResponse"),
  );
  aligned(
    input.observedPhotonEnergyEv,
    input.observedSquaredDirectTaucResponse,
    "spectrum",
  );
  strictlyIncreasing(input.observedPhotonEnergyEv, "energy");
  input.callerSelectedFitIndices.forEach((v) =>
    bounded(v, "fitIndex", 0, input.observedPhotonEnergyEv.length - 1),
  );
  unique(input.callerSelectedFitIndices.map(String), "fitIndices");
  const fit = linearFit(
    input.callerSelectedFitIndices.map((i) => input.observedPhotonEnergyEv[i]),
    input.callerSelectedFitIndices.map(
      (i) => input.observedSquaredDirectTaucResponse[i],
    ),
  );
  positive(fit.slope, "direct Tauc slope");
  return {
    measuredDirectTaucGapEv: -fit.intercept / fit.slope,
    selectedTaucFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhotonEnergyEv: [1, 2, 3, 4],
  observedSquaredDirectTaucResponse: [0, 0, 1, 2],
  callerSelectedFitIndices: [2, 3],
} satisfies Input;
export const exampleOutput = {
  measuredDirectTaucGapEv: 2,
  selectedTaucFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/beta-ga2o3-bandgap",
  title: "Semiconductor Beta Ga2o3 Bandgap Calculator",
  description:
    "Extract caller-selected direct-transition Tauc fit of actual BetaGa2o3 optical response, selection/transition convention independently verified; no room-temperature bandgap lookup, indirect-transition assumption or fitted-gap truth claim.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredDirectTaucGapEv",
      label: "Measured direct tauc gap ev",
      kind: "number",
    },
    {
      id: "selectedTaucFitRSquared",
      label: "Selected tauc fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPhotonEnergyEv: value.observedPhotonEnergyEv as readonly number[],
      observedSquaredDirectTaucResponse:
        value.observedSquaredDirectTaucResponse as readonly number[],
      callerSelectedFitIndices:
        value.callerSelectedFitIndices as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
