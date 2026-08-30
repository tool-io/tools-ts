import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesYears: readonly number[];
  readonly calvingSpeedsMPerYear: readonly number[];
  readonly frontIceSpeedsMPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly netRetreatSpeedsMPerYear: readonly number[];
  readonly integratedRetreatDistanceM: number;
}>;
const inputFields = [
  { id: "timesYears", label: "Times years", kind: "numberList" },
  {
    id: "calvingSpeedsMPerYear",
    label: "Calving speeds m per year",
    kind: "numberList",
  },
  {
    id: "frontIceSpeedsMPerYear",
    label: "Front ice speeds m per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calvingSpeedsMPerYear.forEach((v) =>
    nonnegative(v, "calvingSpeedsMPerYear"),
  );
  input.frontIceSpeedsMPerYear.forEach((v) =>
    nonnegative(v, "frontIceSpeedsMPerYear"),
  );
  aligned(input.timesYears, input.calvingSpeedsMPerYear, "timesYears");
  aligned(input.timesYears, input.frontIceSpeedsMPerYear, "timesYears");
  const netRetreatSpeedsMPerYear = input.calvingSpeedsMPerYear.map(
    (v, i) => v - input.frontIceSpeedsMPerYear[i],
  );
  return {
    netRetreatSpeedsMPerYear,
    integratedRetreatDistanceM: integral(
      input.timesYears,
      netRetreatSpeedsMPerYear,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesYears: [0, 1, 2],
  calvingSpeedsMPerYear: [10, 20, 10],
  frontIceSpeedsMPerYear: [5, 5, 5],
} satisfies Input;
export const exampleOutput = {
  netRetreatSpeedsMPerYear: [5, 15, 5],
  integratedRetreatDistanceM: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/calving-front-retreat-distance",
  title: "Calving Front Retreat Distance",
  description:
    "Integrate signed calving-minus-normal-ice-speed front retreat with trapezoids over time; negative values represent advance and front melt must be included externally if relevant.",
  inputs: inputFields,
  outputs: [
    {
      id: "netRetreatSpeedsMPerYear",
      label: "Net retreat speeds m per year",
      kind: "numberList",
    },
    {
      id: "integratedRetreatDistanceM",
      label: "Integrated retreat distance m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesYears: value.timesYears as readonly number[],
      calvingSpeedsMPerYear: value.calvingSpeedsMPerYear as readonly number[],
      frontIceSpeedsMPerYear: value.frontIceSpeedsMPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
