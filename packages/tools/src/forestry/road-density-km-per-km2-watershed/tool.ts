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
  readonly subcatchmentRoadLengthsKm: readonly number[];
  readonly subcatchmentAreasKm2: readonly number[];
  readonly callerRoadDensityLimitKmPerKm2: number;
}>;
export type Output = Readonly<{
  readonly localRoadDensitiesKmPerKm2: readonly number[];
  readonly pooledRoadDensityKmPerKm2: number;
  readonly aboveCallerDensityFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "subcatchmentRoadLengthsKm",
    label: "Subcatchment road lengths km",
    kind: "numberList",
  },
  {
    id: "subcatchmentAreasKm2",
    label: "Subcatchment areas km2",
    kind: "numberList",
  },
  {
    id: "callerRoadDensityLimitKmPerKm2",
    label: "Caller road density limit km per km2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.subcatchmentAreasKm2.forEach((v) =>
    positive(v, "subcatchmentAreasKm2"),
  );
  input.subcatchmentRoadLengthsKm.forEach((v) =>
    nonnegative(v, "subcatchmentRoadLengthsKm"),
  );
  nonnegative(
    input.callerRoadDensityLimitKmPerKm2,
    "callerRoadDensityLimitKmPerKm2",
  );
  aligned(
    input.subcatchmentRoadLengthsKm,
    input.subcatchmentAreasKm2,
    "subcatchmentRoadLengthsKm",
  );
  const localRoadDensitiesKmPerKm2 = input.subcatchmentRoadLengthsKm.map(
    (v, i) => v / input.subcatchmentAreasKm2[i],
  );
  return {
    localRoadDensitiesKmPerKm2,
    pooledRoadDensityKmPerKm2:
      input.subcatchmentRoadLengthsKm.reduce((a, b) => a + b, 0) /
      input.subcatchmentAreasKm2.reduce((a, b) => a + b, 0),
    aboveCallerDensityFlags: localRoadDensitiesKmPerKm2.map((v) =>
      v > input.callerRoadDensityLimitKmPerKm2 ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  subcatchmentRoadLengthsKm: [2, 9],
  subcatchmentAreasKm2: [1, 3],
  callerRoadDensityLimitKmPerKm2: 2.5,
} satisfies Input;
export const exampleOutput = {
  localRoadDensitiesKmPerKm2: [2, 3],
  pooledRoadDensityKmPerKm2: 2.75,
  aboveCallerDensityFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/road-density-km-per-km2-watershed",
  title: "Watershed Road Density km/km²",
  description:
    "Aggregate nonoverlapping local road-length/area inventories and caller density exceedances, not simple averaging of unequal catchments; road locations and drainage connectivity are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "localRoadDensitiesKmPerKm2",
      label: "Local road densities km per km2",
      kind: "numberList",
    },
    {
      id: "pooledRoadDensityKmPerKm2",
      label: "Pooled road density km per km2",
      kind: "number",
    },
    {
      id: "aboveCallerDensityFlags",
      label: "Above caller density flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      subcatchmentRoadLengthsKm:
        value.subcatchmentRoadLengthsKm as readonly number[],
      subcatchmentAreasKm2: value.subcatchmentAreasKm2 as readonly number[],
      callerRoadDensityLimitKmPerKm2:
        value.callerRoadDensityLimitKmPerKm2 as number,
    }),
});
export const run = tool.execute;
export default tool;
