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
  readonly meanTemperaturesC: readonly number[];
  readonly intervalDays: readonly number[];
  readonly initialSnowWaterEquivalentMm: number;
  readonly snowDegreeDayFactorMmPerCDay: number;
  readonly iceDegreeDayFactorMmPerCDay: number;
}>;
export type Output = Readonly<{
  readonly snowMeltMm: readonly number[];
  readonly iceMeltMm: readonly number[];
  readonly remainingSnowMm: number;
  readonly totalMeltMmWaterEquivalent: number;
}>;
const inputFields = [
  { id: "meanTemperaturesC", label: "Mean temperatures c", kind: "numberList" },
  { id: "intervalDays", label: "Interval days", kind: "numberList" },
  {
    id: "initialSnowWaterEquivalentMm",
    label: "Initial snow water equivalent mm",
    kind: "number",
  },
  {
    id: "snowDegreeDayFactorMmPerCDay",
    label: "Snow degree day factor mm per c day",
    kind: "number",
  },
  {
    id: "iceDegreeDayFactorMmPerCDay",
    label: "Ice degree day factor mm per c day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDays.forEach((v) => positive(v, "intervalDays"));
  positive(input.snowDegreeDayFactorMmPerCDay, "snowDegreeDayFactorMmPerCDay");
  positive(input.iceDegreeDayFactorMmPerCDay, "iceDegreeDayFactorMmPerCDay");
  nonnegative(
    input.initialSnowWaterEquivalentMm,
    "initialSnowWaterEquivalentMm",
  );
  aligned(input.meanTemperaturesC, input.intervalDays, "meanTemperaturesC");
  let remainingSnowMm = input.initialSnowWaterEquivalentMm;
  const snowMeltMm: number[] = [],
    iceMeltMm: number[] = [];
  input.meanTemperaturesC.forEach((v, i) => {
    const pdd = Math.max(0, v) * input.intervalDays[i],
      snow = Math.min(
        remainingSnowMm,
        pdd * input.snowDegreeDayFactorMmPerCDay,
      );
    remainingSnowMm -= snow;
    snowMeltMm.push(snow);
    iceMeltMm.push(
      Math.max(0, pdd - snow / input.snowDegreeDayFactorMmPerCDay) *
        input.iceDegreeDayFactorMmPerCDay,
    );
  });
  return {
    snowMeltMm,
    iceMeltMm,
    remainingSnowMm,
    totalMeltMmWaterEquivalent:
      snowMeltMm.reduce((a, b) => a + b, 0) +
      iceMeltMm.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  meanTemperaturesC: [-1, 2, 4],
  intervalDays: [1, 1, 1],
  initialSnowWaterEquivalentMm: 6,
  snowDegreeDayFactorMmPerCDay: 3,
  iceDegreeDayFactorMmPerCDay: 5,
} satisfies Input;
export const exampleOutput = {
  snowMeltMm: [0, 6, 0],
  iceMeltMm: [0, 0, 20],
  remainingSnowMm: 0,
  totalMeltMmWaterEquivalent: 26,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/pdd-positive-degree-days-melt",
  title: "PDD Positive Degree Days Melt",
  description:
    "Apply separate snow/ice positive-degree-day factors sequentially while exhausting a supplied snow-water reservoir; interval temperatures are means and no snow replenishment is assumed.",
  inputs: inputFields,
  outputs: [
    { id: "snowMeltMm", label: "Snow melt mm", kind: "numberList" },
    { id: "iceMeltMm", label: "Ice melt mm", kind: "numberList" },
    { id: "remainingSnowMm", label: "Remaining snow mm", kind: "number" },
    {
      id: "totalMeltMmWaterEquivalent",
      label: "Total melt mm water equivalent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      meanTemperaturesC: value.meanTemperaturesC as readonly number[],
      intervalDays: value.intervalDays as readonly number[],
      initialSnowWaterEquivalentMm:
        value.initialSnowWaterEquivalentMm as number,
      snowDegreeDayFactorMmPerCDay:
        value.snowDegreeDayFactorMmPerCDay as number,
      iceDegreeDayFactorMmPerCDay: value.iceDegreeDayFactorMmPerCDay as number,
    }),
});
export const run = tool.execute;
export default tool;
