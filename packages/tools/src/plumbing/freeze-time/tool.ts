import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedContainedWaterMassKg: number;
  readonly observedInitialWaterC: number;
  readonly callerWaterHeatCapacityJkgK: number;
  readonly callerLatentFusionJkg: number;
  readonly callerMeasuredConstantHeatRemovalWatts: number;
  readonly callerFreezePointC: number;
}>;
export type Output = Readonly<{
  readonly modeledSecondsToFirstFreeze: number;
  readonly modeledAdditionalLatentFreezeSeconds: number;
  readonly modeledSecondsToCompleteFreeze: number;
}>;
const inputFields = [
  {
    id: "observedContainedWaterMassKg",
    label: "Observed contained water mass kg",
    kind: "number",
  },
  {
    id: "observedInitialWaterC",
    label: "Observed initial water c",
    kind: "number",
  },
  {
    id: "callerWaterHeatCapacityJkgK",
    label: "Caller water heat capacity jkg k",
    kind: "number",
  },
  {
    id: "callerLatentFusionJkg",
    label: "Caller latent fusion jkg",
    kind: "number",
  },
  {
    id: "callerMeasuredConstantHeatRemovalWatts",
    label: "Caller measured constant heat removal watts",
    kind: "number",
  },
  { id: "callerFreezePointC", label: "Caller freeze point c", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerWaterHeatCapacityJkgK, "callerWaterHeatCapacityJkgK");
  positive(input.callerLatentFusionJkg, "callerLatentFusionJkg");
  positive(
    input.callerMeasuredConstantHeatRemovalWatts,
    "callerMeasuredConstantHeatRemovalWatts",
  );
  nonnegative(
    input.observedContainedWaterMassKg,
    "observedContainedWaterMassKg",
  );
  ordered(input.callerFreezePointC, input.observedInitialWaterC);
  const sensible =
      (input.observedContainedWaterMassKg *
        input.callerWaterHeatCapacityJkgK *
        (input.observedInitialWaterC - input.callerFreezePointC)) /
      input.callerMeasuredConstantHeatRemovalWatts,
    latent =
      (input.observedContainedWaterMassKg * input.callerLatentFusionJkg) /
      input.callerMeasuredConstantHeatRemovalWatts;
  return {
    modeledSecondsToFirstFreeze: sensible,
    modeledAdditionalLatentFreezeSeconds: latent,
    modeledSecondsToCompleteFreeze: sensible + latent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedContainedWaterMassKg: 1,
  observedInitialWaterC: 5,
  callerWaterHeatCapacityJkgK: 4000,
  callerLatentFusionJkg: 300000,
  callerMeasuredConstantHeatRemovalWatts: 100,
  callerFreezePointC: 0,
} satisfies Input;
export const exampleOutput = {
  modeledSecondsToFirstFreeze: 200,
  modeledAdditionalLatentFreezeSeconds: 3000,
  modeledSecondsToCompleteFreeze: 3200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/freeze-time",
  title: "Plumbing Freeze Time Calculator",
  description:
    "Explicit lumped-water constant measured heat-removal scenario separating sensible cooling and fusion latent heat; no wall/ice-front transient, pipe-burst prediction or frost protection guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledSecondsToFirstFreeze",
      label: "Modeled seconds to first freeze",
      kind: "number",
    },
    {
      id: "modeledAdditionalLatentFreezeSeconds",
      label: "Modeled additional latent freeze seconds",
      kind: "number",
    },
    {
      id: "modeledSecondsToCompleteFreeze",
      label: "Modeled seconds to complete freeze",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedContainedWaterMassKg:
        value.observedContainedWaterMassKg as number,
      observedInitialWaterC: value.observedInitialWaterC as number,
      callerWaterHeatCapacityJkgK: value.callerWaterHeatCapacityJkgK as number,
      callerLatentFusionJkg: value.callerLatentFusionJkg as number,
      callerMeasuredConstantHeatRemovalWatts:
        value.callerMeasuredConstantHeatRemovalWatts as number,
      callerFreezePointC: value.callerFreezePointC as number,
    }),
});
export const run = tool.execute;
export default tool;
