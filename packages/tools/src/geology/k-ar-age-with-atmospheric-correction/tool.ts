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
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly measuredAr40: number;
  readonly measuredAr36: number;
  readonly callerAtmosphericAr40Ar36: number;
  readonly measuredK40: number;
  readonly kTotalDecayPerYear: number;
  readonly kArBranchDecayPerYear: number;
}>;
export type Output = Readonly<{
  readonly atmosphereCorrectedKArAgeYears: number;
}>;
const inputFields = [
  { id: "measuredAr40", label: "Measured ar40", kind: "number" },
  { id: "measuredAr36", label: "Measured ar36", kind: "number" },
  {
    id: "callerAtmosphericAr40Ar36",
    label: "Caller atmospheric ar40 ar36",
    kind: "number",
  },
  { id: "measuredK40", label: "Measured k40", kind: "number" },
  { id: "kTotalDecayPerYear", label: "K total decay per year", kind: "number" },
  {
    id: "kArBranchDecayPerYear",
    label: "K ar branch decay per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredK40, "measuredK40");
  positive(input.kTotalDecayPerYear, "kTotalDecayPerYear");
  positive(input.kArBranchDecayPerYear, "kArBranchDecayPerYear");
  nonnegative(input.measuredAr40, "measuredAr40");
  nonnegative(input.measuredAr36, "measuredAr36");
  nonnegative(input.callerAtmosphericAr40Ar36, "callerAtmosphericAr40Ar36");
  if (input.kArBranchDecayPerYear > input.kTotalDecayPerYear)
    simpleError("decay", "Ar branch≤total.");
  const radiogenic = nonnegative(
    input.measuredAr40 - input.measuredAr36 * input.callerAtmosphericAr40Ar36,
    "radiogenicAr",
  );
  return {
    atmosphereCorrectedKArAgeYears:
      Math.log1p(
        ((input.kTotalDecayPerYear / input.kArBranchDecayPerYear) *
          radiogenic) /
          input.measuredK40,
      ) / input.kTotalDecayPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredAr40: 10,
  measuredAr36: 1,
  callerAtmosphericAr40Ar36: 2,
  measuredK40: 2,
  kTotalDecayPerYear: 1,
  kArBranchDecayPerYear: 0.5,
} satisfies Input;
export const exampleOutput = {
  atmosphereCorrectedKArAgeYears: 2.1972245773362196,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/k-ar-age-with-atmospheric-correction",
  title: "Geology K Ar Age With Atmospheric Correction Calculator",
  description:
    "K–Ar branched decay with independently atmospheric40Ar/36Ar correction and common atom/mole units; not supplied radiogenic ratio-only age. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "atmosphereCorrectedKArAgeYears",
      label: "Atmosphere corrected k ar age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredAr40: value.measuredAr40 as number,
      measuredAr36: value.measuredAr36 as number,
      callerAtmosphericAr40Ar36: value.callerAtmosphericAr40Ar36 as number,
      measuredK40: value.measuredK40 as number,
      kTotalDecayPerYear: value.kTotalDecayPerYear as number,
      kArBranchDecayPerYear: value.kArBranchDecayPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
