import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  extrema,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedWellDepthsM: readonly number[];
  readonly observedWellConcentrationsPerM3: readonly number[];
  readonly callerSurfaceDepthIndex: number;
}>;
export type Output = Readonly<{
  readonly observedRetrogradePeakDepthsM: readonly number[];
  readonly observedPeakConcentrationPerM3: number;
  readonly observedPeakAboveSurfaceFactor: number;
}>;
const inputFields = [
  {
    id: "observedWellDepthsM",
    label: "Observed well depths m",
    kind: "numberList",
  },
  {
    id: "observedWellConcentrationsPerM3",
    label: "Observed well concentrations per m3",
    kind: "numberList",
  },
  {
    id: "callerSurfaceDepthIndex",
    label: "Caller surface depth index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWellConcentrationsPerM3.forEach((v) =>
    positive(v, "observedWellConcentrationsPerM3"),
  );
  input.observedWellDepthsM.forEach((v) =>
    nonnegative(v, "observedWellDepthsM"),
  );
  bounded(
    input.callerSurfaceDepthIndex,
    "surface",
    0,
    input.observedWellDepthsM.length - 1,
  );
  const peak = extrema(
    input.observedWellDepthsM,
    input.observedWellConcentrationsPerM3,
    true,
  );
  return {
    observedRetrogradePeakDepthsM: peak.coordinates,
    observedPeakConcentrationPerM3: peak.value,
    observedPeakAboveSurfaceFactor:
      peak.value /
      input.observedWellConcentrationsPerM3[input.callerSurfaceDepthIndex],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWellDepthsM: [0, 1, 2],
  observedWellConcentrationsPerM3: [1, 5, 2],
  callerSurfaceDepthIndex: 0,
} satisfies Input;
export const exampleOutput = {
  observedRetrogradePeakDepthsM: [1],
  observedPeakConcentrationPerM3: 5,
  observedPeakAboveSurfaceFactor: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/retrograde-well-profile",
  title: "Semiconductor Retrograde Well Profile Calculator",
  description:
    "Extract actual retrograde-well peak depths, tied peaks and independently identified surface-reference contrast; no assumed Gaussian/implant energy model.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRetrogradePeakDepthsM",
      label: "Observed retrograde peak depths m",
      kind: "numberList",
    },
    {
      id: "observedPeakConcentrationPerM3",
      label: "Observed peak concentration per m3",
      kind: "number",
    },
    {
      id: "observedPeakAboveSurfaceFactor",
      label: "Observed peak above surface factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWellDepthsM: value.observedWellDepthsM as readonly number[],
      observedWellConcentrationsPerM3:
        value.observedWellConcentrationsPerM3 as readonly number[],
      callerSurfaceDepthIndex: value.callerSurfaceDepthIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
