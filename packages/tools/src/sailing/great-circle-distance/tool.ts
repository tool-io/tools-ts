import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const EARTH_RADIUS_NM = 3440.065;

export type GreatCircleDistanceInput = {
  readonly fromLatitudeDeg: number;
  readonly fromLongitudeDeg: number;
  readonly toLatitudeDeg: number;
  readonly toLongitudeDeg: number;
};

export type GreatCircleDistanceOutput = {
  readonly distanceNm: number;
};

export const greatCircleDistanceExample = {
  input: {
    fromLatitudeDeg: 51.5,
    fromLongitudeDeg: 0,
    toLatitudeDeg: 48.85,
    toLongitudeDeg: -2.35,
  },
  output: { distanceNm: 182.95431225315144 },
} satisfies ToolExample<GreatCircleDistanceInput, GreatCircleDistanceOutput>;

export const greatCircleDistanceTool = createSimpleTool({
  id: "sailing/great-circle-distance",
  title: "Great Circle Distance Calculator",
  description:
    "Calculate the great circle distance in nautical miles between two geographic positions.",
  inputs: [
    {
      id: "fromLatitudeDeg",
      kind: "number",
      label: "From latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      id: "fromLongitudeDeg",
      kind: "number",
      label: "From longitude",
      maximum: 180,
      minimum: -180,
    },
    {
      id: "toLatitudeDeg",
      kind: "number",
      label: "To latitude",
      maximum: 90,
      minimum: -90,
    },
    {
      id: "toLongitudeDeg",
      kind: "number",
      label: "To longitude",
      maximum: 180,
      minimum: -180,
    },
  ],
  outputs: [{ id: "distanceNm", kind: "number", label: "Distance" }],
  calculate: (input) => {
    const toRad = Math.PI / 180;
    const deltaPhi =
      (input.toLatitudeDeg as number) * toRad -
      (input.fromLatitudeDeg as number) * toRad;
    const deltaLambda =
      ((input.toLongitudeDeg as number) - (input.fromLongitudeDeg as number)) *
      toRad;
    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos((input.fromLatitudeDeg as number) * toRad) *
        Math.cos((input.toLatitudeDeg as number) * toRad) *
        Math.sin(deltaLambda / 2) ** 2;
    return {
      distanceNm: 2 * EARTH_RADIUS_NM * Math.asin(Math.min(1, Math.sqrt(a))),
    };
  },
});
export const runGreatCircleDistance = greatCircleDistanceTool.execute;
export default greatCircleDistanceTool;
