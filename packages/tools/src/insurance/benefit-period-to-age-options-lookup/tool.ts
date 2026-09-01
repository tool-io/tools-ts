import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAttainedAgeYears: number;
  readonly callerBenefitOptionIds: readonly string[];
  readonly callerVerifiedBenefitEndAgesYears: readonly number[];
  readonly callerRequestedBenefitHorizonYears: number;
}>;
export type Output = Readonly<{
  readonly callerRemainingBenefitYears: readonly number[];
  readonly callerHorizonCompatibleBenefitOptionIds: readonly string[];
}>;
const inputFields = [
  {
    id: "observedAttainedAgeYears",
    label: "Observed attained age years",
    kind: "number",
  },
  {
    id: "callerBenefitOptionIds",
    label: "Caller benefit option ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBenefitEndAgesYears",
    label: "Caller verified benefit end ages years",
    kind: "numberList",
  },
  {
    id: "callerRequestedBenefitHorizonYears",
    label: "Caller requested benefit horizon years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.observedAttainedAgeYears, "observedAttainedAgeYears");
  input.callerVerifiedBenefitEndAgesYears.forEach((v) =>
    nonnegative(v, "callerVerifiedBenefitEndAgesYears"),
  );
  nonnegative(
    input.callerRequestedBenefitHorizonYears,
    "callerRequestedBenefitHorizonYears",
  );
  aligned(
    input.callerBenefitOptionIds,
    input.callerVerifiedBenefitEndAgesYears,
    "callerBenefitOptionIds",
  );
  unique(input.callerBenefitOptionIds, "options");
  if (
    input.callerVerifiedBenefitEndAgesYears.some((v) => v > 120) ||
    input.observedAttainedAgeYears > 120
  )
    simpleError("ages", "Caller ages bounded to [0,120].");
  const years = input.callerVerifiedBenefitEndAgesYears.map((v) =>
    Math.max(0, v - input.observedAttainedAgeYears),
  );
  return {
    callerRemainingBenefitYears: years,
    callerHorizonCompatibleBenefitOptionIds:
      input.callerBenefitOptionIds.filter(
        (_, i) => years[i] >= input.callerRequestedBenefitHorizonYears,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAttainedAgeYears: 40,
  callerBenefitOptionIds: ["age60", "age65"],
  callerVerifiedBenefitEndAgesYears: [60, 65],
  callerRequestedBenefitHorizonYears: 22,
} satisfies Input;
export const exampleOutput = {
  callerRemainingBenefitYears: [20, 25],
  callerHorizonCompatibleBenefitOptionIds: ["age65"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/benefit-period-to-age-options-lookup",
  title: "Benefit Period To Age Options Lookup",
  description:
    "Compare actual attained age with independently verified benefit-to-age options and caller requested horizon; not civil birth-date calculation, automatic renewability or medical readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRemainingBenefitYears",
      label: "Caller remaining benefit years",
      kind: "numberList",
    },
    {
      id: "callerHorizonCompatibleBenefitOptionIds",
      label: "Caller horizon compatible benefit option ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAttainedAgeYears: value.observedAttainedAgeYears as number,
      callerBenefitOptionIds: value.callerBenefitOptionIds as readonly string[],
      callerVerifiedBenefitEndAgesYears:
        value.callerVerifiedBenefitEndAgesYears as readonly number[],
      callerRequestedBenefitHorizonYears:
        value.callerRequestedBenefitHorizonYears as number,
    }),
});
export const run = tool.execute;
export default tool;
