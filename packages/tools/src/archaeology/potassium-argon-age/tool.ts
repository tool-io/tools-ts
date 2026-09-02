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
  readonly independentRadiogenicAr40OverK40Ratio: number;
  readonly callerTotalK40DecayPerYear: number;
  readonly callerArBranchDecayPerYear: number;
}>;
export type Output = Readonly<{
  readonly conditionalPotassiumArgonAgeYears: number;
}>;
const inputFields = [
  {
    id: "independentRadiogenicAr40OverK40Ratio",
    label: "Independent radiogenic ar40 over k40 ratio",
    kind: "number",
  },
  {
    id: "callerTotalK40DecayPerYear",
    label: "Caller total k40 decay per year",
    kind: "number",
  },
  {
    id: "callerArBranchDecayPerYear",
    label: "Caller ar branch decay per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerTotalK40DecayPerYear, "callerTotalK40DecayPerYear");
  positive(input.callerArBranchDecayPerYear, "callerArBranchDecayPerYear");
  nonnegative(
    input.independentRadiogenicAr40OverK40Ratio,
    "independentRadiogenicAr40OverK40Ratio",
  );
  if (input.callerArBranchDecayPerYear > input.callerTotalK40DecayPerYear)
    simpleError("branch", "Branchdecay≤totaldecay.");
  return {
    conditionalPotassiumArgonAgeYears:
      Math.log1p(
        (input.independentRadiogenicAr40OverK40Ratio *
          input.callerTotalK40DecayPerYear) /
          input.callerArBranchDecayPerYear,
      ) / input.callerTotalK40DecayPerYear,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentRadiogenicAr40OverK40Ratio: 0.1,
  callerTotalK40DecayPerYear: 0.001,
  callerArBranchDecayPerYear: 0.0001,
} satisfies Input;
export const exampleOutput = {
  conditionalPotassiumArgonAgeYears: 693.1471805599452,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/potassium-argon-age",
  title: "Potassium-Argon Age Calculator",
  description:
    "Closed KA rage log(1+(λtotal/λAr) radiogenic Ar/K)/λtotal, independently radiogenic isotope ratio—not total Aror elemental K; retention/initial Arexternal. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalPotassiumArgonAgeYears",
      label: "Conditional potassium argon age years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentRadiogenicAr40OverK40Ratio:
        value.independentRadiogenicAr40OverK40Ratio as number,
      callerTotalK40DecayPerYear: value.callerTotalK40DecayPerYear as number,
      callerArBranchDecayPerYear: value.callerArBranchDecayPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
