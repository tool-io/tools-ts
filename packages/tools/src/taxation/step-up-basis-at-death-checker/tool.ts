import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  signedSum,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly priorEligibleBasisMinor: number;
  readonly callerApplicableDeathValuationMinor: number;
  readonly callerInheritedFractionBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly conditionalAdjustedBasisMinor: number;
  readonly signedBasisAdjustmentMinor: number;
}>;
const inputFields = [
  {
    id: "priorEligibleBasisMinor",
    label: "Prior eligible basis minor",
    kind: "number",
  },
  {
    id: "callerApplicableDeathValuationMinor",
    label: "Caller applicable death valuation minor",
    kind: "number",
  },
  {
    id: "callerInheritedFractionBasisPoints",
    label: "Caller inherited fraction basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.priorEligibleBasisMinor, "priorEligibleBasisMinor");
  money(
    input.callerApplicableDeathValuationMinor,
    "callerApplicableDeathValuationMinor",
  );
  bounded(input.callerInheritedFractionBasisPoints, "fraction", 0, 10000);
  const d = signedSum([
      input.callerApplicableDeathValuationMinor,
      -input.priorEligibleBasisMinor,
    ]),
    adj = roundMinor(
      BigInt(d) * BigInt(input.callerInheritedFractionBasisPoints),
      10000n,
    );
  return {
    conditionalAdjustedBasisMinor: signedSum([
      input.priorEligibleBasisMinor,
      adj,
    ]),
    signedBasisAdjustmentMinor: adj,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  priorEligibleBasisMinor: 80,
  callerApplicableDeathValuationMinor: 100,
  callerInheritedFractionBasisPoints: 5000,
} satisfies Input;
export const exampleOutput = {
  conditionalAdjustedBasisMinor: 90,
  signedBasisAdjustmentMinor: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/step-up-basis-at-death-checker",
  title: "Step Up Basis At Death Checker",
  description:
    "Caller eligible inherited fraction death-value basis replacement with signed stepUP/DOWN, not blanket estate basis or valuation election. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAdjustedBasisMinor",
      label: "Conditional adjusted basis minor",
      kind: "number",
    },
    {
      id: "signedBasisAdjustmentMinor",
      label: "Signed basis adjustment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      priorEligibleBasisMinor: value.priorEligibleBasisMinor as number,
      callerApplicableDeathValuationMinor:
        value.callerApplicableDeathValuationMinor as number,
      callerInheritedFractionBasisPoints:
        value.callerInheritedFractionBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
