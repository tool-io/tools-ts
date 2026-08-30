import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMeanTemperaturesC: readonly number[];
  readonly dailyMaximumTemperaturesC: readonly number[];
  readonly callerBaseTemperatureC: number;
  readonly callerLatitudeDayLengthCoefficient: number;
}>;
export type Output = Readonly<{
  readonly huglinDailyContributions: readonly number[];
  readonly huglinIndex: number;
}>;
const inputFields = [
  {
    id: "dailyMeanTemperaturesC",
    label: "Daily mean temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyMaximumTemperaturesC",
    label: "Daily maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "callerBaseTemperatureC",
    label: "Caller base temperature c",
    kind: "number",
  },
  {
    id: "callerLatitudeDayLengthCoefficient",
    label: "Caller latitude day length coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerLatitudeDayLengthCoefficient,
    "callerLatitudeDayLengthCoefficient",
  );
  aligned(
    input.dailyMeanTemperaturesC,
    input.dailyMaximumTemperaturesC,
    "dailyMeanTemperaturesC",
  );
  if (
    input.dailyMaximumTemperaturesC.some(
      (v, i) => v < input.dailyMeanTemperaturesC[i],
    )
  )
    simpleError("maximum", "Daily maximum must be at least daily mean.");
  const huglinDailyContributions = input.dailyMeanTemperaturesC.map(
    (t, i) =>
      Math.max(
        0,
        (t + input.dailyMaximumTemperaturesC[i]) / 2 -
          input.callerBaseTemperatureC,
      ) * input.callerLatitudeDayLengthCoefficient,
  );
  return {
    huglinDailyContributions,
    huglinIndex: huglinDailyContributions.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMeanTemperaturesC: [10, 20],
  dailyMaximumTemperaturesC: [20, 30],
  callerBaseTemperatureC: 10,
  callerLatitudeDayLengthCoefficient: 1.1,
} satisfies Input;
export const exampleOutput = {
  huglinDailyContributions: [5.5, 16.5],
  huglinIndex: 22,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/huglin-index",
  title: "Huglin Heliothermal Index",
  description:
    "Calculate Huglin mean/maximum heliothermal contributions over caller supplied season with caller latitude/daylength coefficient and base; no implicit hemisphere calendar or grape suitability classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "huglinDailyContributions",
      label: "Huglin daily contributions",
      kind: "numberList",
    },
    { id: "huglinIndex", label: "Huglin index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dailyMeanTemperaturesC: value.dailyMeanTemperaturesC as readonly number[],
      dailyMaximumTemperaturesC:
        value.dailyMaximumTemperaturesC as readonly number[],
      callerBaseTemperatureC: value.callerBaseTemperatureC as number,
      callerLatitudeDayLengthCoefficient:
        value.callerLatitudeDayLengthCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
