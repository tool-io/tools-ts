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
  count,
  aligned,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyMeanTemperaturesC: readonly number[];
  readonly monthlyDaylightHours: readonly number[];
  readonly monthlyDayCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly annualThornthwaiteHeatIndex: number;
  readonly thornthwaiteExponent: number;
  readonly monthlyThornthwaitePetMm: readonly number[];
}>;
const inputFields = [
  {
    id: "monthlyMeanTemperaturesC",
    label: "Monthly mean temperatures c",
    kind: "numberList",
  },
  {
    id: "monthlyDaylightHours",
    label: "Monthly daylight hours",
    kind: "numberList",
  },
  { id: "monthlyDayCounts", label: "Monthly day counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyDayCounts.forEach((v) => positive(v, "monthlyDayCounts"));
  input.monthlyDaylightHours.forEach((v) =>
    nonnegative(v, "monthlyDaylightHours"),
  );
  input.monthlyDayCounts.forEach((v) => count(v, "monthlyDayCounts"));
  aligned(
    input.monthlyMeanTemperaturesC,
    input.monthlyDaylightHours,
    "monthlyMeanTemperaturesC",
  );
  aligned(
    input.monthlyMeanTemperaturesC,
    input.monthlyDayCounts,
    "monthlyMeanTemperaturesC",
  );
  months(input.monthlyMeanTemperaturesC, "months");
  if (
    input.monthlyMeanTemperaturesC.some((t) => t > 26.5) ||
    input.monthlyDaylightHours.some((h) => h > 24) ||
    input.monthlyDayCounts.some((d) => d < 28 || d > 31)
  )
    simpleError(
      "domain",
      "Basic Thornthwaite power equation restricted to monthly T≤26.5 C, daylight≤24h and valid month lengths; high-temperature table corrections excluded.",
    );
  const annualThornthwaiteHeatIndex = input.monthlyMeanTemperaturesC.reduce(
      (s, t) => s + (Math.max(0, t) / 5) ** 1.514,
      0,
    ),
    thornthwaiteExponent =
      6.75e-7 * annualThornthwaiteHeatIndex ** 3 -
      7.71e-5 * annualThornthwaiteHeatIndex ** 2 +
      0.01792 * annualThornthwaiteHeatIndex +
      0.49239;
  return {
    annualThornthwaiteHeatIndex,
    thornthwaiteExponent,
    monthlyThornthwaitePetMm: input.monthlyMeanTemperaturesC.map((t, i) =>
      t <= 0 || annualThornthwaiteHeatIndex === 0
        ? 0
        : (((16 *
            ((10 * t) / annualThornthwaiteHeatIndex) ** thornthwaiteExponent *
            input.monthlyDaylightHours[i]) /
            12) *
            input.monthlyDayCounts[i]) /
          30,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyMeanTemperaturesC: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
  monthlyDaylightHours: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
  monthlyDayCounts: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
} satisfies Input;
export const exampleOutput = {
  annualThornthwaiteHeatIndex: 97.88137756782629,
  thornthwaiteExponent: 2.1407477862616355,
  monthlyThornthwaitePetMm: [
    73.86829548795049, 73.86829548795049, 73.86829548795049, 73.86829548795049,
    73.86829548795049, 73.86829548795049, 73.86829548795049, 73.86829548795049,
    73.86829548795049, 73.86829548795049, 73.86829548795049, 73.86829548795049,
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/pet-thornthwaite-monthly",
  title: "Thornthwaite PET Monthly",
  description:
    "Evaluate basic monthly Thornthwaite PET from twelve temperature/daylight/month-length normals with explicit heat index and high-temperature calibration-domain refusal; no measured ET or soil budget.",
  inputs: inputFields,
  outputs: [
    {
      id: "annualThornthwaiteHeatIndex",
      label: "Annual thornthwaite heat index",
      kind: "number",
    },
    {
      id: "thornthwaiteExponent",
      label: "Thornthwaite exponent",
      kind: "number",
    },
    {
      id: "monthlyThornthwaitePetMm",
      label: "Monthly thornthwaite pet mm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyMeanTemperaturesC:
        value.monthlyMeanTemperaturesC as readonly number[],
      monthlyDaylightHours: value.monthlyDaylightHours as readonly number[],
      monthlyDayCounts: value.monthlyDayCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
