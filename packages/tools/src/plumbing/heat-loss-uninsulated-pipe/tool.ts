import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBarePipeAreasM2: readonly number[];
  readonly callerMatchedConvectiveCoefficientsWattsM2K: readonly number[];
  readonly observedPipeSurfaceTemperaturesC: readonly number[];
  readonly observedAmbientTemperaturesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedBarePipeConvectiveHeatWatts: readonly number[];
  readonly combinedSignedConvectiveHeatWatts: number;
}>;
const inputFields = [
  {
    id: "observedBarePipeAreasM2",
    label: "Observed bare pipe areas m2",
    kind: "numberList",
  },
  {
    id: "callerMatchedConvectiveCoefficientsWattsM2K",
    label: "Caller matched convective coefficients watts m2 k",
    kind: "numberList",
  },
  {
    id: "observedPipeSurfaceTemperaturesC",
    label: "Observed pipe surface temperatures c",
    kind: "numberList",
  },
  {
    id: "observedAmbientTemperaturesC",
    label: "Observed ambient temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedConvectiveCoefficientsWattsM2K.forEach((v) =>
    positive(v, "callerMatchedConvectiveCoefficientsWattsM2K"),
  );
  input.observedBarePipeAreasM2.forEach((v) =>
    nonnegative(v, "observedBarePipeAreasM2"),
  );
  aligned(
    input.observedBarePipeAreasM2,
    input.callerMatchedConvectiveCoefficientsWattsM2K,
    "observedBarePipeAreasM2",
  );
  aligned(
    input.observedBarePipeAreasM2,
    input.observedPipeSurfaceTemperaturesC,
    "observedBarePipeAreasM2",
  );
  aligned(
    input.observedBarePipeAreasM2,
    input.observedAmbientTemperaturesC,
    "observedBarePipeAreasM2",
  );
  const heat = input.observedBarePipeAreasM2.map(
    (v, i) =>
      v *
      input.callerMatchedConvectiveCoefficientsWattsM2K[i] *
      (input.observedPipeSurfaceTemperaturesC[i] -
        input.observedAmbientTemperaturesC[i]),
  );
  return {
    signedBarePipeConvectiveHeatWatts: heat,
    combinedSignedConvectiveHeatWatts: sum(heat),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBarePipeAreasM2: [1, 2],
  callerMatchedConvectiveCoefficientsWattsM2K: [5, 10],
  observedPipeSurfaceTemperaturesC: [40, 10],
  observedAmbientTemperaturesC: [20, 20],
} satisfies Input;
export const exampleOutput = {
  signedBarePipeConvectiveHeatWatts: [100, -200],
  combinedSignedConvectiveHeatWatts: -100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/heat-loss-uninsulated-pipe",
  title: "Plumbing Heat Loss Uninsulated Pipe Calculator",
  description:
    "Account actual heterogeneous bare-pipe convection surfaces and signed temperature differences; radiation/evaporation omitted rather than disguised as total heat loss, not insulated cylinder model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBarePipeConvectiveHeatWatts",
      label: "Signed bare pipe convective heat watts",
      kind: "numberList",
    },
    {
      id: "combinedSignedConvectiveHeatWatts",
      label: "Combined signed convective heat watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBarePipeAreasM2:
        value.observedBarePipeAreasM2 as readonly number[],
      callerMatchedConvectiveCoefficientsWattsM2K:
        value.callerMatchedConvectiveCoefficientsWattsM2K as readonly number[],
      observedPipeSurfaceTemperaturesC:
        value.observedPipeSurfaceTemperaturesC as readonly number[],
      observedAmbientTemperaturesC:
        value.observedAmbientTemperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
