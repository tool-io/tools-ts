import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  signedSum,
  roundMinor,
  positiveCounts,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerRequiredPostageMinor: number;
  readonly observedUpratedPostageMinor: number;
  readonly callerDeficiencyMultiplierNumerator: number;
  readonly callerDeficiencyMultiplierDenominator: number;
  readonly callerFixedDeficiencyFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly signedPostageShortfallMinor: number;
  readonly callerAssessedDeficiencyMinor: number;
}>;
const inputFields = [
  {
    id: "callerRequiredPostageMinor",
    label: "Caller required postage minor",
    kind: "number",
  },
  {
    id: "observedUpratedPostageMinor",
    label: "Observed uprated postage minor",
    kind: "number",
  },
  {
    id: "callerDeficiencyMultiplierNumerator",
    label: "Caller deficiency multiplier numerator",
    kind: "number",
  },
  {
    id: "callerDeficiencyMultiplierDenominator",
    label: "Caller deficiency multiplier denominator",
    kind: "number",
  },
  {
    id: "callerFixedDeficiencyFeeMinor",
    label: "Caller fixed deficiency fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerRequiredPostageMinor,
    input.observedUpratedPostageMinor,
    input.callerFixedDeficiencyFeeMinor,
  ].forEach((v) => money(v, "postage"));
  positiveCounts([
    input.callerDeficiencyMultiplierNumerator,
    input.callerDeficiencyMultiplierDenominator,
  ]);
  const shortfall = signedSum([
    input.callerRequiredPostageMinor,
    -input.observedUpratedPostageMinor,
  ]);
  return {
    signedPostageShortfallMinor: shortfall,
    callerAssessedDeficiencyMinor:
      shortfall > 0
        ? signedSum([
            roundMinor(
              BigInt(shortfall) *
                BigInt(input.callerDeficiencyMultiplierNumerator),
              BigInt(input.callerDeficiencyMultiplierDenominator),
            ),
            input.callerFixedDeficiencyFeeMinor,
          ])
        : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRequiredPostageMinor: 120,
  observedUpratedPostageMinor: 100,
  callerDeficiencyMultiplierNumerator: 2,
  callerDeficiencyMultiplierDenominator: 1,
  callerFixedDeficiencyFeeMinor: 10,
} satisfies Input;
export const exampleOutput = {
  signedPostageShortfallMinor: 20,
  callerAssessedDeficiencyMinor: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/uprated-shortpaid-deficiency-calculator",
  title: "Uprated Cover Short-Paid Fee Deficiency Calculator",
  description:
    "Audit actual uprated postage shortfall and independently verified deficiency fee rule; excess postage retained signed. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPostageShortfallMinor",
      label: "Signed postage shortfall minor",
      kind: "number",
    },
    {
      id: "callerAssessedDeficiencyMinor",
      label: "Caller assessed deficiency minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRequiredPostageMinor: value.callerRequiredPostageMinor as number,
      observedUpratedPostageMinor: value.observedUpratedPostageMinor as number,
      callerDeficiencyMultiplierNumerator:
        value.callerDeficiencyMultiplierNumerator as number,
      callerDeficiencyMultiplierDenominator:
        value.callerDeficiencyMultiplierDenominator as number,
      callerFixedDeficiencyFeeMinor:
        value.callerFixedDeficiencyFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
