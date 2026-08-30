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
  readonly dailyMinimumTemperaturesC: readonly number[];
  readonly dailyMaximumTemperaturesC: readonly number[];
  readonly dailyExtraterrestrialRadiationMjPerM2: readonly number[];
  readonly callerHargreavesCoefficient: number;
  readonly callerTemperatureOffsetC: number;
}>;
export type Output = Readonly<{
  readonly hargreavesReferenceEtMmPerDay: readonly number[];
  readonly totalHargreavesReferenceEtMm: number;
}>;
const inputFields = [
  {
    id: "dailyMinimumTemperaturesC",
    label: "Daily minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyMaximumTemperaturesC",
    label: "Daily maximum temperatures c",
    kind: "numberList",
  },
  {
    id: "dailyExtraterrestrialRadiationMjPerM2",
    label: "Daily extraterrestrial radiation mj per m2",
    kind: "numberList",
  },
  {
    id: "callerHargreavesCoefficient",
    label: "Caller hargreaves coefficient",
    kind: "number",
  },
  {
    id: "callerTemperatureOffsetC",
    label: "Caller temperature offset c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerHargreavesCoefficient, "callerHargreavesCoefficient");
  input.dailyExtraterrestrialRadiationMjPerM2.forEach((v) =>
    nonnegative(v, "dailyExtraterrestrialRadiationMjPerM2"),
  );
  aligned(
    input.dailyMinimumTemperaturesC,
    input.dailyMaximumTemperaturesC,
    "dailyMinimumTemperaturesC",
  );
  aligned(
    input.dailyMinimumTemperaturesC,
    input.dailyExtraterrestrialRadiationMjPerM2,
    "dailyMinimumTemperaturesC",
  );
  const hargreavesReferenceEtMmPerDay = input.dailyMinimumTemperaturesC.map(
    (t, i) =>
      input.callerHargreavesCoefficient *
      nonnegative(
        (t + input.dailyMaximumTemperaturesC[i]) / 2 +
          input.callerTemperatureOffsetC,
        "temperatureFactor",
      ) *
      Math.sqrt(
        nonnegative(input.dailyMaximumTemperaturesC[i] - t, "diurnalRange"),
      ) *
      input.dailyExtraterrestrialRadiationMjPerM2[i] *
      0.408,
  );
  return {
    hargreavesReferenceEtMmPerDay,
    totalHargreavesReferenceEtMm: hargreavesReferenceEtMmPerDay.reduce(
      (a, b) => a + b,
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMinimumTemperaturesC: [10],
  dailyMaximumTemperaturesC: [20],
  dailyExtraterrestrialRadiationMjPerM2: [30],
  callerHargreavesCoefficient: 0.0023,
  callerTemperatureOffsetC: 17.8,
} satisfies Input;
export const exampleOutput = {
  hargreavesReferenceEtMmPerDay: [2.920001654601175],
  totalHargreavesReferenceEtMm: 2.920001654601175,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/eto-hargreaves",
  title: "Reference Evapotranspiration Hargreaves",
  description:
    "Evaluate calibrated daily Hargreaves reference ET with explicit MJ/m²/day radiation converted to equivalent evaporation by 0.408; differs from Penman–Monteith weather inputs and is not actual crop ET.",
  inputs: inputFields,
  outputs: [
    {
      id: "hargreavesReferenceEtMmPerDay",
      label: "Hargreaves reference et mm per day",
      kind: "numberList",
    },
    {
      id: "totalHargreavesReferenceEtMm",
      label: "Total hargreaves reference et mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMinimumTemperaturesC:
        value.dailyMinimumTemperaturesC as readonly number[],
      dailyMaximumTemperaturesC:
        value.dailyMaximumTemperaturesC as readonly number[],
      dailyExtraterrestrialRadiationMjPerM2:
        value.dailyExtraterrestrialRadiationMjPerM2 as readonly number[],
      callerHargreavesCoefficient: value.callerHargreavesCoefficient as number,
      callerTemperatureOffsetC: value.callerTemperatureOffsetC as number,
    }),
});
export const run = tool.execute;
export default tool;
