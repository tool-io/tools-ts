import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const EARTH_RADIUS_NM = 3440.065;

export type RhumbLineDistanceInput = {
  readonly fromLatitudeDeg: number;
  readonly fromLongitudeDeg: number;
  readonly toLatitudeDeg: number;
  readonly toLongitudeDeg: number;
};

export type RhumbLineDistanceOutput = {
  readonly distanceNm: number;
};

export const rhumbLineDistanceExample = {
  input: {
    fromLatitudeDeg: 51.5,
    fromLongitudeDeg: 0,
    toLatitudeDeg: 48.85,
    toLongitudeDeg: -2.35,
  },
  output: { distanceNm: 182.96187840043424 },
} satisfies ToolExample<RhumbLineDistanceInput, RhumbLineDistanceOutput>;

export const rhumbLineDistanceTool = createSimpleTool({
  id: "nautical/rhumb-line-distance",
  title: "Rhumb Line Distance Calculator",
  description:
    "Calculate the rhumb line distance in nautical miles between two geographic positions along a constant bearing.",
  inputs: [
    {
      id: "fromLatitudeDeg",
      kind: "number",
      label: "From latitude",
      maximum: 89.999999999,
      minimum: -89.999999999,
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
      maximum: 89.999999999,
      minimum: -89.999999999,
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
    const rad = Math.PI / 180;
    const fromLatRad = (input.fromLatitudeDeg as number) * rad;
    const toLatRad = (input.toLatitudeDeg as number) * rad;
    if (
      Math.abs(fromLatRad) >= Math.PI / 2 ||
      Math.abs(toLatRad) >= Math.PI / 2
    )
      simpleError(
        "fromLatitudeDeg",
        "Rhumb-line distance is undefined at the geographic poles.",
      );
    const deltaPhi = toLatRad - fromLatRad;
    let deltaLambda =
      ((input.toLongitudeDeg as number) - (input.fromLongitudeDeg as number)) *
      rad;
    if (Math.abs(deltaLambda) > Math.PI)
      deltaLambda += deltaLambda > 0 ? -2 * Math.PI : 2 * Math.PI;
    const deltaPhiPrime = Math.log(
      Math.tan(Math.PI / 4 + toLatRad / 2) /
        Math.tan(Math.PI / 4 + fromLatRad / 2),
    );
    const q =
      Math.abs(deltaPhiPrime) < 1e-10
        ? Math.cos(fromLatRad)
        : deltaPhi / deltaPhiPrime;
    return {
      distanceNm:
        Math.sqrt(deltaPhi * deltaPhi + q * q * deltaLambda * deltaLambda) *
        EARTH_RADIUS_NM,
    };
  },
});
export const runRhumbLineDistance = rhumbLineDistanceTool.execute;
export default rhumbLineDistanceTool;
