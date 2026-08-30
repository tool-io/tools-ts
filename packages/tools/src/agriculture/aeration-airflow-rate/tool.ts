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
  readonly measuredOutletAirSpeedsMPerSecond: readonly number[];
  readonly outletSegmentAreasM2: readonly number[];
  readonly grainInventoryTonnes: number;
  readonly callerMinimumAirflowM3PerMinutePerTonne: number;
}>;
export type Output = Readonly<{
  readonly measuredTotalAirflowM3PerMinute: number;
  readonly specificMeasuredAirflowM3PerMinutePerTonne: number;
  readonly aboveCallerAirflowCriterion: boolean;
}>;
const inputFields = [
  {
    id: "measuredOutletAirSpeedsMPerSecond",
    label: "Measured outlet air speeds m per second",
    kind: "numberList",
  },
  {
    id: "outletSegmentAreasM2",
    label: "Outlet segment areas m2",
    kind: "numberList",
  },
  {
    id: "grainInventoryTonnes",
    label: "Grain inventory tonnes",
    kind: "number",
  },
  {
    id: "callerMinimumAirflowM3PerMinutePerTonne",
    label: "Caller minimum airflow m3 per minute per tonne",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.outletSegmentAreasM2.forEach((v) =>
    positive(v, "outletSegmentAreasM2"),
  );
  positive(input.grainInventoryTonnes, "grainInventoryTonnes");
  input.measuredOutletAirSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "measuredOutletAirSpeedsMPerSecond"),
  );
  nonnegative(
    input.callerMinimumAirflowM3PerMinutePerTonne,
    "callerMinimumAirflowM3PerMinutePerTonne",
  );
  aligned(
    input.measuredOutletAirSpeedsMPerSecond,
    input.outletSegmentAreasM2,
    "measuredOutletAirSpeedsMPerSecond",
  );
  const measuredTotalAirflowM3PerMinute =
      60 *
      input.measuredOutletAirSpeedsMPerSecond.reduce(
        (s, v, i) => s + v * input.outletSegmentAreasM2[i],
        0,
      ),
    specificMeasuredAirflowM3PerMinutePerTonne =
      measuredTotalAirflowM3PerMinute / input.grainInventoryTonnes;
  return {
    measuredTotalAirflowM3PerMinute,
    specificMeasuredAirflowM3PerMinutePerTonne,
    aboveCallerAirflowCriterion:
      specificMeasuredAirflowM3PerMinutePerTonne >=
      input.callerMinimumAirflowM3PerMinutePerTonne,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredOutletAirSpeedsMPerSecond: [1, 2],
  outletSegmentAreasM2: [0.1, 0.2],
  grainInventoryTonnes: 10,
  callerMinimumAirflowM3PerMinutePerTonne: 2,
} satisfies Input;
export const exampleOutput = {
  measuredTotalAirflowM3PerMinute: 30,
  specificMeasuredAirflowM3PerMinutePerTonne: 3,
  aboveCallerAirflowCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/aeration-airflow-rate",
  title: "Agriculture Aeration Airflow Rate",
  description:
    "Aggregate measured nonoverlapping outlet-section air delivery and normalize actual grain mass against caller criterion; no fan curve, uniform speed assumption or grain-storage condition guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredTotalAirflowM3PerMinute",
      label: "Measured total airflow m3 per minute",
      kind: "number",
    },
    {
      id: "specificMeasuredAirflowM3PerMinutePerTonne",
      label: "Specific measured airflow m3 per minute per tonne",
      kind: "number",
    },
    {
      id: "aboveCallerAirflowCriterion",
      label: "Above caller airflow criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredOutletAirSpeedsMPerSecond:
        value.measuredOutletAirSpeedsMPerSecond as readonly number[],
      outletSegmentAreasM2: value.outletSegmentAreasM2 as readonly number[],
      grainInventoryTonnes: value.grainInventoryTonnes as number,
      callerMinimumAirflowM3PerMinutePerTonne:
        value.callerMinimumAirflowM3PerMinutePerTonne as number,
    }),
});
export const run = tool.execute;
export default tool;
