import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly layerBoundaryDepthsM: readonly number[];
  readonly layerDensitiesKgM3: readonly number[];
  readonly iceDensityKgM3: number;
  readonly iceEquivalentAccumulationMYear: number;
  readonly lockInDepthM: number;
  readonly closeOffDepthM: number;
}>;
export type Output = Readonly<{
  readonly modeledLockInIceAgeYears: number;
  readonly modeledCloseOffIceAgeYears: number;
  readonly modeledAgeBetweenLockInAndCloseOffYears: number;
}>;
const inputFields = [
  {
    id: "layerBoundaryDepthsM",
    label: "Layer boundary depths m",
    kind: "numberList",
  },
  {
    id: "layerDensitiesKgM3",
    label: "Layer densities kg m3",
    kind: "numberList",
  },
  { id: "iceDensityKgM3", label: "Ice density kg m3", kind: "number" },
  {
    id: "iceEquivalentAccumulationMYear",
    label: "Ice equivalent accumulation m year",
    kind: "number",
  },
  { id: "lockInDepthM", label: "Lock in depth m", kind: "number" },
  { id: "closeOffDepthM", label: "Close off depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerDensitiesKgM3.forEach((v) => positive(v, "layerDensitiesKgM3"));
  positive(input.iceDensityKgM3, "iceDensityKgM3");
  positive(
    input.iceEquivalentAccumulationMYear,
    "iceEquivalentAccumulationMYear",
  );
  nonnegative(input.lockInDepthM, "lockInDepthM");
  nonnegative(input.closeOffDepthM, "closeOffDepthM");
  strictlyIncreasing(input.layerBoundaryDepthsM, "depth");
  if (
    input.layerBoundaryDepthsM[0] !== 0 ||
    input.layerBoundaryDepthsM.length !== input.layerDensitiesKgM3.length + 1 ||
    input.layerDensitiesKgM3.some((v) => v > input.iceDensityKgM3) ||
    input.lockInDepthM > input.closeOffDepthM ||
    input.closeOffDepthM > input.layerBoundaryDepthsM.at(-1)!
  )
    simpleError(
      "column",
      "Surface-anchored layered firn and observed ordered in-column lock-in/close-off depths required.",
    );
  const age = (d: number) =>
      sum(
        input.layerDensitiesKgM3.map(
          (rho, i) =>
            (Math.max(
              0,
              Math.min(d, input.layerBoundaryDepthsM[i + 1]) -
                input.layerBoundaryDepthsM[i],
            ) *
              (rho / input.iceDensityKgM3)) /
            input.iceEquivalentAccumulationMYear,
        ),
      ),
    lock = age(input.lockInDepthM),
    close = age(input.closeOffDepthM);
  return {
    modeledLockInIceAgeYears: lock,
    modeledCloseOffIceAgeYears: close,
    modeledAgeBetweenLockInAndCloseOffYears: close - lock,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerBoundaryDepthsM: [0, 10, 20],
  layerDensitiesKgM3: [500, 800],
  iceDensityKgM3: 1000,
  iceEquivalentAccumulationMYear: 1,
  lockInDepthM: 10,
  closeOffDepthM: 20,
} satisfies Input;
export const exampleOutput = {
  modeledLockInIceAgeYears: 5,
  modeledCloseOffIceAgeYears: 13,
  modeledAgeBetweenLockInAndCloseOffYears: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/close-off-age-lock-in-depth",
  title: "Close Off Age Lock In Depth Calculator",
  description:
    "Estimate ice residence ages at supplied lock-in/close-off depths from layered mass and steady accumulation; not gas age, gas-ice age difference, densification kinetics or automatically locating close-off.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledLockInIceAgeYears",
      label: "Modeled lock in ice age years",
      kind: "number",
    },
    {
      id: "modeledCloseOffIceAgeYears",
      label: "Modeled close off ice age years",
      kind: "number",
    },
    {
      id: "modeledAgeBetweenLockInAndCloseOffYears",
      label: "Modeled age between lock in and close off years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerBoundaryDepthsM: value.layerBoundaryDepthsM as readonly number[],
      layerDensitiesKgM3: value.layerDensitiesKgM3 as readonly number[],
      iceDensityKgM3: value.iceDensityKgM3 as number,
      iceEquivalentAccumulationMYear:
        value.iceEquivalentAccumulationMYear as number,
      lockInDepthM: value.lockInDepthM as number,
      closeOffDepthM: value.closeOffDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
