import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  roundMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerInitialLtcDailyBenefitMinor: number;
  readonly callerAnnualInflationBasisPoints: number;
  readonly callerProjectionYears: number;
  readonly callerInflationIsCompound: boolean;
}>;
export type Output = Readonly<{
  readonly callerProjectedDailyBenefitMinorByYear: readonly number[];
  readonly callerFinalDailyBenefitMinor: number;
}>;
const inputFields = [
  {
    id: "callerInitialLtcDailyBenefitMinor",
    label: "Caller initial ltc daily benefit minor",
    kind: "number",
  },
  {
    id: "callerAnnualInflationBasisPoints",
    label: "Caller annual inflation basis points",
    kind: "number",
  },
  {
    id: "callerProjectionYears",
    label: "Caller projection years",
    kind: "number",
  },
  {
    id: "callerInflationIsCompound",
    label: "Caller inflation is compound",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.callerInitialLtcDailyBenefitMinor);
  bounded(input.callerAnnualInflationBasisPoints, "inflation", 0, 10000);
  bounded(input.callerProjectionYears, "years", 0, 100);
  const benefits = [input.callerInitialLtcDailyBenefitMinor];
  for (let year = 1; year <= input.callerProjectionYears; year++) {
    const value = input.callerInflationIsCompound
      ? roundMinor(
          BigInt(benefits[year - 1]) *
            BigInt(10000 + input.callerAnnualInflationBasisPoints),
          10000n,
        )
      : roundMinor(
          BigInt(input.callerInitialLtcDailyBenefitMinor) *
            BigInt(10000 + year * input.callerAnnualInflationBasisPoints),
          10000n,
        );
    benefits.push(value);
  }
  return {
    callerProjectedDailyBenefitMinorByYear: benefits,
    callerFinalDailyBenefitMinor: benefits.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerInitialLtcDailyBenefitMinor: 10000,
  callerAnnualInflationBasisPoints: 1000,
  callerProjectionYears: 3,
  callerInflationIsCompound: true,
} satisfies Input;
export const exampleOutput = {
  callerProjectedDailyBenefitMinorByYear: [10000, 11000, 12100, 13310],
  callerFinalDailyBenefitMinor: 13310,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/ltc-inflation-protection-compound-option",
  title: "LTC Inflation Protection Compound Option Calculator",
  description:
    "Project caller LTC daily benefit under explicit simple/compound rider option, rounding compound benefit annually and simple benefit from original base; no premium, adequacy, eligibility or guaranteed future purchasing power.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerProjectedDailyBenefitMinorByYear",
      label: "Caller projected daily benefit minor by year",
      kind: "numberList",
    },
    {
      id: "callerFinalDailyBenefitMinor",
      label: "Caller final daily benefit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerInitialLtcDailyBenefitMinor:
        value.callerInitialLtcDailyBenefitMinor as number,
      callerAnnualInflationBasisPoints:
        value.callerAnnualInflationBasisPoints as number,
      callerProjectionYears: value.callerProjectionYears as number,
      callerInflationIsCompound: value.callerInflationIsCompound as boolean,
    }),
});
export const run = tool.execute;
export default tool;
