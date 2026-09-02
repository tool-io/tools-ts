import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedTh230U238ActivityRatio: number;
  readonly observedU234U238ActivityRatio: number;
  readonly callerTh230DecayPerYear: number;
  readonly callerU234DecayPerYear: number;
  readonly callerMaximumAgeYears: number;
}>;
export type Output = Readonly<{
  readonly conditionalClosedSystemAgeYears: number;
}>;
const inputFields = [
  {
    id: "observedTh230U238ActivityRatio",
    label: "Observed th230 u238 activity ratio",
    kind: "number",
  },
  {
    id: "observedU234U238ActivityRatio",
    label: "Observed u234 u238 activity ratio",
    kind: "number",
  },
  {
    id: "callerTh230DecayPerYear",
    label: "Caller th230 decay per year",
    kind: "number",
  },
  {
    id: "callerU234DecayPerYear",
    label: "Caller u234 decay per year",
    kind: "number",
  },
  {
    id: "callerMaximumAgeYears",
    label: "Caller maximum age years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.observedU234U238ActivityRatio,
    "observedU234U238ActivityRatio",
  );
  positive(input.callerTh230DecayPerYear, "callerTh230DecayPerYear");
  positive(input.callerU234DecayPerYear, "callerU234DecayPerYear");
  positive(input.callerMaximumAgeYears, "callerMaximumAgeYears");
  nonnegative(
    input.observedTh230U238ActivityRatio,
    "observedTh230U238ActivityRatio",
  );
  const a = input.callerTh230DecayPerYear,
    b = input.callerU234DecayPerYear;
  if (a <= b || input.observedU234U238ActivityRatio < 1)
    simpleError(
      "branch",
      "This monotone initialTh230=0model requiresλ230>λ234andpresent234/238≥1.",
    );
  const model = (t: number) =>
    -Math.expm1(-a * t) +
    (((input.observedU234U238ActivityRatio - 1) * a) / (a - b)) *
      -Math.expm1(-(a - b) * t);
  if (model(input.callerMaximumAgeYears) < input.observedTh230U238ActivityRatio)
    simpleError("bracket", "No age inside caller finite age bracket.");
  let lo = 0,
    hi = input.callerMaximumAgeYears;
  for (let i = 0; i < 80; i++) {
    const m = lo + (hi - lo) / 2;
    if (model(m) < input.observedTh230U238ActivityRatio) lo = m;
    else hi = m;
  }
  return { conditionalClosedSystemAgeYears: lo + (hi - lo) / 2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTh230U238ActivityRatio: 0.5,
  observedU234U238ActivityRatio: 1,
  callerTh230DecayPerYear: 0.001,
  callerU234DecayPerYear: 0.0001,
  callerMaximumAgeYears: 10000,
} satisfies Input;
export const exampleOutput = {
  conditionalClosedSystemAgeYears: 693.1471805599452,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/uranium-series-age-speleothem",
  title: "Uranium-Series Speleothem Age Calculator",
  description:
    "Closed no initial Th 230230 Th/U238 chain inversion includes separately measured present U234 excess, bounded monotone bisection; no detrital/open-system correction or actual dated-age certification. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalClosedSystemAgeYears",
      label: "Conditional closed system age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTh230U238ActivityRatio:
        value.observedTh230U238ActivityRatio as number,
      observedU234U238ActivityRatio:
        value.observedU234U238ActivityRatio as number,
      callerTh230DecayPerYear: value.callerTh230DecayPerYear as number,
      callerU234DecayPerYear: value.callerU234DecayPerYear as number,
      callerMaximumAgeYears: value.callerMaximumAgeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
