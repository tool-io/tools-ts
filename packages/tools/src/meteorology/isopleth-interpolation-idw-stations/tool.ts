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
  aligned,
  sum,
  shape,
  weights,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly stationPlanarCoordinates: readonly (readonly number[])[];
  readonly stationValues: readonly number[];
  readonly queryX: number;
  readonly queryY: number;
  readonly callerDistancePower: number;
}>;
export type Output = Readonly<{
  readonly idwInterpolatedValue: number;
  readonly normalizedStationWeights: readonly number[];
}>;
const inputFields = [
  {
    id: "stationPlanarCoordinates",
    label: "Station planar coordinates",
    kind: "matrix",
  },
  { id: "stationValues", label: "Station values", kind: "numberList" },
  { id: "queryX", label: "Query x", kind: "number" },
  { id: "queryY", label: "Query y", kind: "number" },
  { id: "callerDistancePower", label: "Caller distance power", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerDistancePower, "callerDistancePower");
  aligned(
    input.stationPlanarCoordinates,
    input.stationValues,
    "stationPlanarCoordinates",
  );
  if (
    shape(input.stationPlanarCoordinates, "coordinates") !== 2 ||
    input.stationValues.length > 128 ||
    input.callerDistancePower > 8
  )
    simpleError("IDW", "≤128 same planar-coordinate stations and0<p≤8.");
  const d = input.stationPlanarCoordinates.map(([x, y]) =>
    Math.hypot(x - input.queryX, y - input.queryY),
  );
  const hits = d.flatMap((v, i) => (v === 0 ? [i] : []));
  if (
    hits.length &&
    hits.some((i) => input.stationValues[i] !== input.stationValues[hits[0]])
  )
    simpleError("collocated", "Conflicting colocated observations.");
  const min = Math.min(...d),
    raw = d.map((v, i) =>
      hits.length
        ? hits.includes(i)
          ? 1
          : 0
        : (min / v) ** input.callerDistancePower,
    ),
    w = weights(raw);
  return {
    idwInterpolatedValue: sum(input.stationValues.map((v, i) => v * w[i])),
    normalizedStationWeights: w,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationPlanarCoordinates: [
    [0, 0],
    [2, 0],
  ],
  stationValues: [1, 3],
  queryX: 1,
  queryY: 0,
  callerDistancePower: 2,
} satisfies Input;
export const exampleOutput = {
  idwInterpolatedValue: 2,
  normalizedStationWeights: [0.5, 0.5],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/isopleth-interpolation-idw-stations",
  title: "Isopleth Interpolation IDW Stations Tool",
  description:
    "Bounded planar IDW actual station values, exact collocated matches/conflicts preserved and stable scaled weights; no geodesy distance or physical isopleth guarantee. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "idwInterpolatedValue",
      label: "Idw interpolated value",
      kind: "number",
    },
    {
      id: "normalizedStationWeights",
      label: "Normalized station weights",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      stationPlanarCoordinates:
        value.stationPlanarCoordinates as readonly (readonly number[])[],
      stationValues: value.stationValues as readonly number[],
      queryX: value.queryX as number,
      queryY: value.queryY as number,
      callerDistancePower: value.callerDistancePower as number,
    }),
});
export const run = tool.execute;
export default tool;
