import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  utcJulianDays: readonly number[];
  dut1Seconds: readonly number[];
  queryUtcJulianDay: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "utcJulianDays", label: "Utc julian days", kind: "numberList" },
  { id: "dut1Seconds", label: "Dut1 seconds", kind: "numberList", unit: "s" },
  { id: "queryUtcJulianDay", label: "Query utc julian day", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.dut1Seconds.every((x) => Math.abs(x) <= 0.9));
  const values = i.dut1Seconds.map(
      (x, j) => x - H.taiMinusUtc(i.utcJulianDays[j]),
    ),
    r = H.knots(i.utcJulianDays, values, i.queryUtcJulianDay),
    tai = H.taiMinusUtc(i.queryUtcJulianDay);
  return H.finish({
    ut1MinusUtcSeconds: r.value + tai,
    ttMinusUt1Seconds: 32.184 - r.value,
    taiMinusUtcSeconds: tai,
    leftIndex: r.left,
    rightIndex: r.right,
  });
};
export const example = {
  input: {
    utcJulianDays: [2451544.5, 2451545.5],
    dut1Seconds: [0.2, 0.4],
    queryUtcJulianDay: 2451545,
  },
  output: {
    result: {
      ut1MinusUtcSeconds: 0.3,
      ttMinusUt1Seconds: 63.884,
      taiMinusUtcSeconds: 32,
      leftIndex: 0,
      rightIndex: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "UT1–UTC Interpolator and Delta T Calculator",
      "UT1-UTC Delta T Rough Interpolator Note Generator",
      "geodesy/deltat-ut1-utc-interpolator-note",
      "geodesy deltat ut1 utc interpolator note",
      "surveying",
    ],
    collections: ["data", "learn"],
    fields: ["geodesy", "surveying"],
    keywords: ["surveying"],
  },
  id: "geodesy/ut1-utc-interpolator",
  title: "UT1–UTC Interpolator and Delta T Calculator",
  description:
    "Interpolate supplied DUT1 observations through continuous UT1-TAI, then distinguish UT1-UTC from DeltaT=TT-UT1 using the pinned IERS leap table; no invented Earth-rotation observations or extrapolation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ut1MinusUtcSeconds: { type: "number" },
          ttMinusUt1Seconds: { type: "number" },
          taiMinusUtcSeconds: { type: "number" },
          leftIndex: { type: "number" },
          rightIndex: { type: "number" },
        },
        required: [
          "ut1MinusUtcSeconds",
          "ttMinusUt1Seconds",
          "taiMinusUtcSeconds",
          "leftIndex",
          "rightIndex",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
