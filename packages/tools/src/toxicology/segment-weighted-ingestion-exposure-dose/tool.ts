import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly concentrationsMgPerLiter: readonly number[];
  readonly dailyIntakeLiters: readonly number[];
  readonly segmentDurationsDays: readonly number[];
  readonly absorptionFractions: readonly number[];
  readonly bodyMassKg: number;
}>;
export type Output = Readonly<{
  readonly segmentAbsorbedDosesMgPerKgDay: readonly number[];
  readonly timeWeightedDoseMgPerKgDay: number;
}>;
const inputFields = [
  {
    id: "concentrationsMgPerLiter",
    label: "Concentrations mg per liter",
    kind: "numberList",
  },
  { id: "dailyIntakeLiters", label: "Daily intake liters", kind: "numberList" },
  {
    id: "segmentDurationsDays",
    label: "Segment durations days",
    kind: "numberList",
  },
  {
    id: "absorptionFractions",
    label: "Absorption fractions",
    kind: "numberList",
  },
  { id: "bodyMassKg", label: "Body mass kg", kind: "number", unit: "kg" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.concentrationsMgPerLiter,
    input.dailyIntakeLiters,
    "concentrationsMgPerLiter",
  );
  aligned(
    input.concentrationsMgPerLiter,
    input.segmentDurationsDays,
    "concentrationsMgPerLiter",
  );
  aligned(
    input.concentrationsMgPerLiter,
    input.absorptionFractions,
    "concentrationsMgPerLiter",
  );
  positive(input.bodyMassKg, "bodyMassKg");
  input.concentrationsMgPerLiter.forEach((v) =>
    nonnegative(v, "concentrationsMgPerLiter"),
  );
  input.dailyIntakeLiters.forEach((v) => nonnegative(v, "dailyIntakeLiters"));
  input.segmentDurationsDays.forEach((v) =>
    positive(v, "segmentDurationsDays"),
  );
  input.absorptionFractions.forEach((v) => fraction(v, "absorptionFractions"));
  const segmentAbsorbedDosesMgPerKgDay = input.concentrationsMgPerLiter.map(
      (v, i) =>
        (v * input.dailyIntakeLiters[i] * input.absorptionFractions[i]) /
        input.bodyMassKg,
    ),
    duration = input.segmentDurationsDays.reduce((a, b) => a + b, 0);
  return {
    segmentAbsorbedDosesMgPerKgDay,
    timeWeightedDoseMgPerKgDay:
      segmentAbsorbedDosesMgPerKgDay.reduce(
        (s, v, i) => s + v * input.segmentDurationsDays[i],
        0,
      ) / duration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  concentrationsMgPerLiter: [1, 2],
  dailyIntakeLiters: [2, 1],
  segmentDurationsDays: [10, 20],
  absorptionFractions: [0.5, 1],
  bodyMassKg: 50,
} satisfies Input;
export const exampleOutput = {
  segmentAbsorbedDosesMgPerKgDay: [0.02, 0.04],
  timeWeightedDoseMgPerKgDay: 0.03333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/segment-weighted-ingestion-exposure-dose",
  title: "Exposure Dose",
  description:
    "Aggregate changing concentration/intake/absorption scenarios over explicit segment durations; absorbed doses are not interchangeable with administered-dose reference values.",
  inputs: inputFields,
  outputs: [
    {
      id: "segmentAbsorbedDosesMgPerKgDay",
      label: "Segment absorbed doses mg per kg day",
      kind: "numberList",
    },
    {
      id: "timeWeightedDoseMgPerKgDay",
      label: "Time weighted dose mg per kg day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      concentrationsMgPerLiter:
        value.concentrationsMgPerLiter as readonly number[],
      dailyIntakeLiters: value.dailyIntakeLiters as readonly number[],
      segmentDurationsDays: value.segmentDurationsDays as readonly number[],
      absorptionFractions: value.absorptionFractions as readonly number[],
      bodyMassKg: value.bodyMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
