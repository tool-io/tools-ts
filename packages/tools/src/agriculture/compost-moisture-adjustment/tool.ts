import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedCompostWetMassKg: number;
  readonly observedCompostWetMoistureFraction: number;
  readonly observedAlreadyAddedAmendmentKg: number;
  readonly callerMatchedAmendmentWetMoistureFraction: number;
  readonly observedAlreadyAddedWaterKg: number;
}>;
export type Output = Readonly<{
  readonly auditedMixedWetMoistureFraction: number;
  readonly auditedMixedWetMassKg: number;
}>;
const inputFields = [
  {
    id: "observedCompostWetMassKg",
    label: "Observed compost wet mass kg",
    kind: "number",
  },
  {
    id: "observedCompostWetMoistureFraction",
    label: "Observed compost wet moisture fraction",
    kind: "number",
  },
  {
    id: "observedAlreadyAddedAmendmentKg",
    label: "Observed already added amendment kg",
    kind: "number",
  },
  {
    id: "callerMatchedAmendmentWetMoistureFraction",
    label: "Caller matched amendment wet moisture fraction",
    kind: "number",
  },
  {
    id: "observedAlreadyAddedWaterKg",
    label: "Observed already added water kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedCompostWetMassKg, "observedCompostWetMassKg");
  nonnegative(
    input.observedAlreadyAddedAmendmentKg,
    "observedAlreadyAddedAmendmentKg",
  );
  nonnegative(input.observedAlreadyAddedWaterKg, "observedAlreadyAddedWaterKg");
  fraction(
    input.observedCompostWetMoistureFraction,
    "observedCompostWetMoistureFraction",
  );
  fraction(
    input.callerMatchedAmendmentWetMoistureFraction,
    "callerMatchedAmendmentWetMoistureFraction",
  );
  const mass =
    input.observedCompostWetMassKg +
    input.observedAlreadyAddedAmendmentKg +
    input.observedAlreadyAddedWaterKg;
  positive(mass, "actual mixed mass");
  return {
    auditedMixedWetMoistureFraction:
      (input.observedCompostWetMassKg *
        input.observedCompostWetMoistureFraction +
        input.observedAlreadyAddedAmendmentKg *
          input.callerMatchedAmendmentWetMoistureFraction +
        input.observedAlreadyAddedWaterKg) /
      mass,
    auditedMixedWetMassKg: mass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCompostWetMassKg: 100,
  observedCompostWetMoistureFraction: 0.4,
  observedAlreadyAddedAmendmentKg: 20,
  callerMatchedAmendmentWetMoistureFraction: 0.1,
  observedAlreadyAddedWaterKg: 5,
} satisfies Input;
export const exampleOutput = {
  auditedMixedWetMoistureFraction: 0.376,
  auditedMixedWetMassKg: 125,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/compost-moisture-adjustment",
  title: "Agriculture Compost Moisture Adjustment Calculator",
  description:
    "Audit actual already-added wet amendment/water blend moisture conservation, not future chemical/material dosing or compost readiness. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "auditedMixedWetMoistureFraction",
      label: "Audited mixed wet moisture fraction",
      kind: "number",
    },
    {
      id: "auditedMixedWetMassKg",
      label: "Audited mixed wet mass kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCompostWetMassKg: value.observedCompostWetMassKg as number,
      observedCompostWetMoistureFraction:
        value.observedCompostWetMoistureFraction as number,
      observedAlreadyAddedAmendmentKg:
        value.observedAlreadyAddedAmendmentKg as number,
      callerMatchedAmendmentWetMoistureFraction:
        value.callerMatchedAmendmentWetMoistureFraction as number,
      observedAlreadyAddedWaterKg: value.observedAlreadyAddedWaterKg as number,
    }),
});
export const run = tool.execute;
export default tool;
