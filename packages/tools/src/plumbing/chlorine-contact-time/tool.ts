import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedContactChamberLiters: number;
  readonly observedWaterLitersMinute: number;
  readonly callerIndependentlyEstablishedBafflingFraction: number;
  readonly observedResidualChlorineMgLiter: number;
}>;
export type Output = Readonly<{
  readonly callerEffectiveContactMinutes: number;
  readonly observedCtMgMinutesLiter: number;
}>;
const inputFields = [
  {
    id: "observedContactChamberLiters",
    label: "Observed contact chamber liters",
    kind: "number",
  },
  {
    id: "observedWaterLitersMinute",
    label: "Observed water liters minute",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedBafflingFraction",
    label: "Caller independently established baffling fraction",
    kind: "number",
  },
  {
    id: "observedResidualChlorineMgLiter",
    label: "Observed residual chlorine mg liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedWaterLitersMinute, "observedWaterLitersMinute");
  nonnegative(
    input.observedContactChamberLiters,
    "observedContactChamberLiters",
  );
  nonnegative(
    input.observedResidualChlorineMgLiter,
    "observedResidualChlorineMgLiter",
  );
  fraction(
    input.callerIndependentlyEstablishedBafflingFraction,
    "callerIndependentlyEstablishedBafflingFraction",
  );
  const t =
    (input.observedContactChamberLiters / input.observedWaterLitersMinute) *
    input.callerIndependentlyEstablishedBafflingFraction;
  return {
    callerEffectiveContactMinutes: t,
    observedCtMgMinutesLiter: input.observedResidualChlorineMgLiter * t,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedContactChamberLiters: 100,
  observedWaterLitersMinute: 10,
  callerIndependentlyEstablishedBafflingFraction: 0.5,
  observedResidualChlorineMgLiter: 1,
} satisfies Input;
export const exampleOutput = {
  callerEffectiveContactMinutes: 5,
  observedCtMgMinutesLiter: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/chlorine-contact-time",
  title: "Plumbing Chlorine Contact Time Calculator",
  description:
    "Audit actual observed residual×caller effective baffled contact time; not chemical dose prescription, pathogen/pH/temperature correction or potable-water approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerEffectiveContactMinutes",
      label: "Caller effective contact minutes",
      kind: "number",
    },
    {
      id: "observedCtMgMinutesLiter",
      label: "Observed ct mg minutes liter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedContactChamberLiters:
        value.observedContactChamberLiters as number,
      observedWaterLitersMinute: value.observedWaterLitersMinute as number,
      callerIndependentlyEstablishedBafflingFraction:
        value.callerIndependentlyEstablishedBafflingFraction as number,
      observedResidualChlorineMgLiter:
        value.observedResidualChlorineMgLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
