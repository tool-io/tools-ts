import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyPrecipitationMm: readonly number[];
  readonly monthlyMeanTemperaturesC: readonly number[];
}>;
export type Output = Readonly<{ readonly annualDeMartonneIndex: number }>;
const inputFields = [
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
  {
    id: "monthlyMeanTemperaturesC",
    label: "Monthly mean temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.monthlyPrecipitationMm.forEach((v) =>
    nonnegative(v, "monthlyPrecipitationMm"),
  );
  aligned(
    input.monthlyPrecipitationMm,
    input.monthlyMeanTemperaturesC,
    "monthlyPrecipitationMm",
  );
  months(input.monthlyPrecipitationMm, "precipitation");
  return {
    annualDeMartonneIndex:
      input.monthlyPrecipitationMm.reduce((a, b) => a + b, 0) /
      positive(mean(input.monthlyMeanTemperaturesC) + 10, "temperatureOffset"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyPrecipitationMm: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  monthlyMeanTemperaturesC: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
} satisfies Input;
export const exampleOutput = { annualDeMartonneIndex: 30 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/aridity-de-martonne",
  title: "De Martonne Aridity Index",
  description:
    "Compute annual De Martonne P/(T+10) from twelve monthly normals, with explicitly positive shifted temperature; not a calibrated drought category or validity at cold singular temperatures.",
  inputs: inputFields,
  outputs: [
    {
      id: "annualDeMartonneIndex",
      label: "Annual de martonne index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
      monthlyMeanTemperaturesC:
        value.monthlyMeanTemperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
