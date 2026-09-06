import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedAltimetricSurfaceHeightsM: readonly number[];
  readonly callerIndependentGeoidHeightsM: readonly number[];
  readonly callerIndependentMeanDynamicTopographyM: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedDynamicTopographyAnomaliesM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedAltimetricSurfaceHeightsM",
    label: "Observed altimetric surface heights m",
    kind: "numberList",
  },
  {
    id: "callerIndependentGeoidHeightsM",
    label: "Caller independent geoid heights m",
    kind: "numberList",
  },
  {
    id: "callerIndependentMeanDynamicTopographyM",
    label: "Caller independent mean dynamic topography m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedAltimetricSurfaceHeightsM,
    input.callerIndependentGeoidHeightsM,
    "observedAltimetricSurfaceHeightsM",
  );
  aligned(
    input.observedAltimetricSurfaceHeightsM,
    input.callerIndependentMeanDynamicTopographyM,
    "observedAltimetricSurfaceHeightsM",
  );
  return {
    signedDynamicTopographyAnomaliesM:
      input.observedAltimetricSurfaceHeightsM.map(
        (v, i) =>
          v -
          input.callerIndependentGeoidHeightsM[i] -
          input.callerIndependentMeanDynamicTopographyM[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAltimetricSurfaceHeightsM: [10, 20],
  callerIndependentGeoidHeightsM: [9, 18],
  callerIndependentMeanDynamicTopographyM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  signedDynamicTopographyAnomaliesM: [0.5, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/dynamic-topography-altimetry-residual",
  title: "Dynamic Topography Altimetry Residual Calculator",
  description:
    "Same-datum altimetry minus independently supplied geoid AND mean dynamic topography, no geodesy transform/model acquisition or trend inference. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedDynamicTopographyAnomaliesM",
      label: "Signed dynamic topography anomalies m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAltimetricSurfaceHeightsM:
        value.observedAltimetricSurfaceHeightsM as readonly number[],
      callerIndependentGeoidHeightsM:
        value.callerIndependentGeoidHeightsM as readonly number[],
      callerIndependentMeanDynamicTopographyM:
        value.callerIndependentMeanDynamicTopographyM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
