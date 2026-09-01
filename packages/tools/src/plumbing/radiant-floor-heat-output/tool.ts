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
  readonly observedFloorSurfaceC: readonly number[];
  readonly observedRoomC: readonly number[];
  readonly callerMatchedFloorEmissionWattsM2K: readonly number[];
  readonly observedActiveFloorAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledRadiantFloorHeatWattsByZone: readonly number[];
  readonly totalModeledFloorHeatWatts: number;
}>;
const inputFields = [
  {
    id: "observedFloorSurfaceC",
    label: "Observed floor surface c",
    kind: "numberList",
  },
  { id: "observedRoomC", label: "Observed room c", kind: "numberList" },
  {
    id: "callerMatchedFloorEmissionWattsM2K",
    label: "Caller matched floor emission watts m2 k",
    kind: "numberList",
  },
  {
    id: "observedActiveFloorAreasM2",
    label: "Observed active floor areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedFloorEmissionWattsM2K.forEach((v) =>
    positive(v, "callerMatchedFloorEmissionWattsM2K"),
  );
  input.observedActiveFloorAreasM2.forEach((v) =>
    nonnegative(v, "observedActiveFloorAreasM2"),
  );
  aligned(
    input.observedFloorSurfaceC,
    input.observedRoomC,
    "observedFloorSurfaceC",
  );
  aligned(
    input.observedFloorSurfaceC,
    input.callerMatchedFloorEmissionWattsM2K,
    "observedFloorSurfaceC",
  );
  aligned(
    input.observedFloorSurfaceC,
    input.observedActiveFloorAreasM2,
    "observedFloorSurfaceC",
  );
  const heats = input.observedFloorSurfaceC.map(
    (v, i) =>
      (v - input.observedRoomC[i]) *
      input.callerMatchedFloorEmissionWattsM2K[i] *
      input.observedActiveFloorAreasM2[i],
  );
  return {
    modeledRadiantFloorHeatWattsByZone: heats,
    totalModeledFloorHeatWatts: sum(heats),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFloorSurfaceC: [30, 25],
  observedRoomC: [20, 20],
  callerMatchedFloorEmissionWattsM2K: [8, 10],
  observedActiveFloorAreasM2: [10, 20],
} satisfies Input;
export const exampleOutput = {
  modeledRadiantFloorHeatWattsByZone: [800, 1000],
  totalModeledFloorHeatWatts: 1800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/radiant-floor-heat-output",
  title: "Plumbing Radiant Floor Heat Output Calculator",
  description:
    "Account actual floor surface/room observations with matched linear effective radiant-plus-convective emission coefficients; negative heat retained, not tube-water temperature or flooring safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledRadiantFloorHeatWattsByZone",
      label: "Modeled radiant floor heat watts by zone",
      kind: "numberList",
    },
    {
      id: "totalModeledFloorHeatWatts",
      label: "Total modeled floor heat watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFloorSurfaceC: value.observedFloorSurfaceC as readonly number[],
      observedRoomC: value.observedRoomC as readonly number[],
      callerMatchedFloorEmissionWattsM2K:
        value.callerMatchedFloorEmissionWattsM2K as readonly number[],
      observedActiveFloorAreasM2:
        value.observedActiveFloorAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
