import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rad, deg, wrap, clamp, skyVector } from "../shared.js";

export type Input = Readonly<{
  readonly raDegrees: number;
  readonly decDegrees: number;
  readonly startJulianEpoch: number;
  readonly endJulianEpoch: number;
}>;
export type Output = Readonly<{
  readonly precessedRaDegrees: number;
  readonly precessedDecDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  skyVector(input.raDegrees, input.decDegrees);
  if (
    input.startJulianEpoch < 1800 ||
    input.startJulianEpoch > 2200 ||
    input.endJulianEpoch < 1800 ||
    input.endJulianEpoch > 2200
  )
    simpleError(
      "startJulianEpoch",
      "This low-precision IAU 1976 precession tool is bounded to epochs 1800–2200.",
    );
  const T = (input.startJulianEpoch - 2000) / 100,
    t = (input.endJulianEpoch - input.startJulianEpoch) / 100,
    zeta = rad(
      ((2306.2181 + 1.39656 * T - 0.000139 * T * T) * t +
        (0.30188 - 0.000344 * T) * t * t +
        0.017998 * t ** 3) /
        3600,
    ),
    z = rad(
      ((2306.2181 + 1.39656 * T - 0.000139 * T * T) * t +
        (1.09468 + 0.000066 * T) * t * t +
        0.018203 * t ** 3) /
        3600,
    ),
    theta = rad(
      ((2004.3109 - 0.8533 * T - 0.000217 * T * T) * t -
        (0.42665 + 0.000217 * T) * t * t -
        0.041833 * t ** 3) /
        3600,
    ),
    a = rad(input.raDegrees),
    d = rad(input.decDegrees),
    A = Math.cos(d) * Math.sin(a + zeta),
    B =
      Math.cos(theta) * Math.cos(d) * Math.cos(a + zeta) -
      Math.sin(theta) * Math.sin(d),
    C =
      Math.sin(theta) * Math.cos(d) * Math.cos(a + zeta) +
      Math.cos(theta) * Math.sin(d);
  return {
    precessedRaDegrees: wrap(deg(Math.atan2(A, B) + z)),
    precessedDecDegrees: deg(Math.asin(clamp(C))),
  };
};
export const exampleInput = {
  raDegrees: 0,
  decDegrees: 0,
  startJulianEpoch: 2000,
  endJulianEpoch: 2050,
} satisfies Input;
export const exampleOutput = {
  precessedRaDegrees: 0.6407181591449038,
  precessedDecDegrees: 0.27834108271999486,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/iau1976-epoch-precession",
  title: "Iau1976 Epoch Precession",
  description:
    "Precess a mean equatorial direction with the bounded IAU 1976 approximation; proper motion, nutation and modern frame bias are not included.",
  inputs: [
    { id: "raDegrees", label: "Ra degrees", kind: "number" },
    { id: "decDegrees", label: "Dec degrees", kind: "number" },
    { id: "startJulianEpoch", label: "Start julian epoch", kind: "number" },
    { id: "endJulianEpoch", label: "End julian epoch", kind: "number" },
  ],
  outputs: [
    { id: "precessedRaDegrees", label: "Precessed ra degrees", kind: "number" },
    {
      id: "precessedDecDegrees",
      label: "Precessed dec degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      raDegrees: value.raDegrees as number,
      decDegrees: value.decDegrees as number,
      startJulianEpoch: value.startJulianEpoch as number,
      endJulianEpoch: value.endJulianEpoch as number,
    }),
});
export const run = tool.execute;
export default tool;
