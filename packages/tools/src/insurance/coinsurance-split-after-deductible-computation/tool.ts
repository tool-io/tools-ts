import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerAllowedClaimMinor: number;
  readonly callerRemainingDeductibleMinor: number;
  readonly callerPatientCoinsuranceBasisPoints: number;
  readonly callerRemainingCountedOopMinor: number;
}>;
export type Output = Readonly<{
  readonly callerAppliedDeductibleMinor: number;
  readonly callerPatientCoinsuranceMinor: number;
  readonly callerPatientPaymentMinor: number;
  readonly callerPlanPaymentMinor: number;
}>;
const inputFields = [
  {
    id: "callerAllowedClaimMinor",
    label: "Caller allowed claim minor",
    kind: "number",
  },
  {
    id: "callerRemainingDeductibleMinor",
    label: "Caller remaining deductible minor",
    kind: "number",
  },
  {
    id: "callerPatientCoinsuranceBasisPoints",
    label: "Caller patient coinsurance basis points",
    kind: "number",
  },
  {
    id: "callerRemainingCountedOopMinor",
    label: "Caller remaining counted oop minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.callerAllowedClaimMinor,
    input.callerRemainingDeductibleMinor,
    input.callerRemainingCountedOopMinor,
  ].forEach((v) => money(v));
  bounded(input.callerPatientCoinsuranceBasisPoints, "coinsurance", 0, 10000);
  const nominalDed = Math.min(
      input.callerAllowedClaimMinor,
      input.callerRemainingDeductibleMinor,
    ),
    ded = Math.min(nominalDed, input.callerRemainingCountedOopMinor),
    nominalCoin = share(
      input.callerAllowedClaimMinor - nominalDed,
      input.callerPatientCoinsuranceBasisPoints,
    ),
    coin = Math.min(nominalCoin, input.callerRemainingCountedOopMinor - ded),
    patient = ded + coin;
  return {
    callerAppliedDeductibleMinor: ded,
    callerPatientCoinsuranceMinor: coin,
    callerPatientPaymentMinor: patient,
    callerPlanPaymentMinor: input.callerAllowedClaimMinor - patient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAllowedClaimMinor: 10000,
  callerRemainingDeductibleMinor: 2000,
  callerPatientCoinsuranceBasisPoints: 2000,
  callerRemainingCountedOopMinor: 3000,
} satisfies Input;
export const exampleOutput = {
  callerAppliedDeductibleMinor: 2000,
  callerPatientCoinsuranceMinor: 1000,
  callerPatientPaymentMinor: 3000,
  callerPlanPaymentMinor: 7000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/coinsurance-split-after-deductible-computation",
  title: "Coinsurance Split After Deductible Computation Tool",
  description:
    "Split caller allowed claim after remaining deductible/coinsurance with explicit counted OOP cap, exact one-currency rounding; all allowed patient shares count here, no balance bill or coverage determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAppliedDeductibleMinor",
      label: "Caller applied deductible minor",
      kind: "number",
    },
    {
      id: "callerPatientCoinsuranceMinor",
      label: "Caller patient coinsurance minor",
      kind: "number",
    },
    {
      id: "callerPatientPaymentMinor",
      label: "Caller patient payment minor",
      kind: "number",
    },
    {
      id: "callerPlanPaymentMinor",
      label: "Caller plan payment minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAllowedClaimMinor: value.callerAllowedClaimMinor as number,
      callerRemainingDeductibleMinor:
        value.callerRemainingDeductibleMinor as number,
      callerPatientCoinsuranceBasisPoints:
        value.callerPatientCoinsuranceBasisPoints as number,
      callerRemainingCountedOopMinor:
        value.callerRemainingCountedOopMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
