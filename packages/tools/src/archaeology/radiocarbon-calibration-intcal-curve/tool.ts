import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  curve,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerIntcalCalendarYearsBp: readonly number[];
  readonly callerIntcalC14AgesBp: readonly number[];
  readonly callerIntcalOneSigmaYears: readonly number[];
  readonly queryCalendarYearBp: number;
}>;
export type Output = Readonly<{
  readonly interpolatedReferenceC14AgeBp: number;
  readonly interpolatedReferenceOneSigmaYears: number;
}>;
const inputFields = [
  {
    id: "callerIntcalCalendarYearsBp",
    label: "Caller intcal calendar years bp",
    kind: "numberList",
  },
  {
    id: "callerIntcalC14AgesBp",
    label: "Caller intcal c14 ages bp",
    kind: "numberList",
  },
  {
    id: "callerIntcalOneSigmaYears",
    label: "Caller intcal one sigma years",
    kind: "numberList",
  },
  {
    id: "queryCalendarYearBp",
    label: "Query calendar year bp",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerIntcalOneSigmaYears.forEach((v) =>
    nonnegative(v, "callerIntcalOneSigmaYears"),
  );
  aligned(
    input.callerIntcalCalendarYearsBp,
    input.callerIntcalOneSigmaYears,
    "callerIntcalCalendarYearsBp",
  );
  return {
    interpolatedReferenceC14AgeBp: curve(
      input.callerIntcalCalendarYearsBp,
      input.callerIntcalC14AgesBp,
      input.queryCalendarYearBp,
    ).value,
    interpolatedReferenceOneSigmaYears: curve(
      input.callerIntcalCalendarYearsBp,
      input.callerIntcalOneSigmaYears,
      input.queryCalendarYearBp,
    ).value,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIntcalCalendarYearsBp: [0, 100, 200],
  callerIntcalC14AgesBp: [0, 90, 210],
  callerIntcalOneSigmaYears: [10, 20, 30],
  queryCalendarYearBp: 150,
} satisfies Input;
export const exampleOutput = {
  interpolatedReferenceC14AgeBp: 150,
  interpolatedReferenceOneSigmaYears: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/radiocarbon-calibration-intcal-curve",
  title: "IntCal Calibration Curve Lookup",
  description:
    "Forward independently verified Int Cal curve row lookup/interpolation at calendar BP(year 1950 anchor), not inversion/intercept-band/Bayesian age calibration already implemented; edition/error basis caller supplies. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedReferenceC14AgeBp",
      label: "Interpolated reference c14 age bp",
      kind: "number",
    },
    {
      id: "interpolatedReferenceOneSigmaYears",
      label: "Interpolated reference one sigma years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIntcalCalendarYearsBp:
        value.callerIntcalCalendarYearsBp as readonly number[],
      callerIntcalC14AgesBp: value.callerIntcalC14AgesBp as readonly number[],
      callerIntcalOneSigmaYears:
        value.callerIntcalOneSigmaYears as readonly number[],
      queryCalendarYearBp: value.queryCalendarYearBp as number,
    }),
});
export const run = tool.execute;
export default tool;
