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
  readonly crossPlumeDistancesM: readonly number[];
  readonly so2ColumnMassesGramsPerM2: readonly number[];
  readonly blankColumnMassesGramsPerM2: readonly number[];
  readonly normalPlumeSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly blankCorrectedColumnIntegralGramsPerM: number;
  readonly signedSo2MassFluxTonnesPerDay: number;
}>;
const inputFields = [
  {
    id: "crossPlumeDistancesM",
    label: "Cross plume distances m",
    kind: "numberList",
  },
  {
    id: "so2ColumnMassesGramsPerM2",
    label: "So2 column masses grams per m2",
    kind: "numberList",
  },
  {
    id: "blankColumnMassesGramsPerM2",
    label: "Blank column masses grams per m2",
    kind: "numberList",
  },
  {
    id: "normalPlumeSpeedMPerSecond",
    label: "Normal plume speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.so2ColumnMassesGramsPerM2.forEach((v) =>
    nonnegative(v, "so2ColumnMassesGramsPerM2"),
  );
  input.blankColumnMassesGramsPerM2.forEach((v) =>
    nonnegative(v, "blankColumnMassesGramsPerM2"),
  );
  aligned(
    input.so2ColumnMassesGramsPerM2,
    input.blankColumnMassesGramsPerM2,
    "so2ColumnMassesGramsPerM2",
  );
  const blankCorrectedColumnIntegralGramsPerM = integral(
    input.crossPlumeDistancesM,
    input.so2ColumnMassesGramsPerM2.map(
      (v, i) => v - input.blankColumnMassesGramsPerM2[i],
    ),
  );
  return {
    blankCorrectedColumnIntegralGramsPerM,
    signedSo2MassFluxTonnesPerDay:
      blankCorrectedColumnIntegralGramsPerM *
      input.normalPlumeSpeedMPerSecond *
      0.0864,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crossPlumeDistancesM: [0, 10, 20],
  so2ColumnMassesGramsPerM2: [0, 2, 0],
  blankColumnMassesGramsPerM2: [0, 0.5, 0],
  normalPlumeSpeedMPerSecond: 10,
} satisfies Input;
export const exampleOutput = {
  blankCorrectedColumnIntegralGramsPerM: 15,
  signedSo2MassFluxTonnesPerDay: 12.96,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/so2-mass-flux-tonnes-day",
  title: "SO2 Mass Flux Tonnes Day",
  description:
    "Integrate blank-corrected SO2 cross-plume column mass and multiply by signed normal plume speed; negative nondetections/transport remain signed, with no eruption-alert threshold or wind-direction inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "blankCorrectedColumnIntegralGramsPerM",
      label: "Blank corrected column integral grams per m",
      kind: "number",
    },
    {
      id: "signedSo2MassFluxTonnesPerDay",
      label: "Signed so2 mass flux tonnes per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crossPlumeDistancesM: value.crossPlumeDistancesM as readonly number[],
      so2ColumnMassesGramsPerM2:
        value.so2ColumnMassesGramsPerM2 as readonly number[],
      blankColumnMassesGramsPerM2:
        value.blankColumnMassesGramsPerM2 as readonly number[],
      normalPlumeSpeedMPerSecond: value.normalPlumeSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
