import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly transactionMinor: number;
  readonly observedAvailableMinor: number;
  readonly callerNsfReturnFeeMinor: number;
  readonly callerOverdraftFeeMinor: number;
  readonly callerWillHonorOverdraft: boolean;
}>;
export type Output = Readonly<{
  readonly shortfallMinor: number;
  readonly modeledChosenFeeMinor: number;
  readonly signedOverdraftMinusNsfFeeMinor: number;
  readonly modeledPaymentHonored: boolean;
}>;
const inputFields = [
  { id: "transactionMinor", label: "Transaction minor", kind: "number" },
  {
    id: "observedAvailableMinor",
    label: "Observed available minor",
    kind: "number",
  },
  {
    id: "callerNsfReturnFeeMinor",
    label: "Caller nsf return fee minor",
    kind: "number",
  },
  {
    id: "callerOverdraftFeeMinor",
    label: "Caller overdraft fee minor",
    kind: "number",
  },
  {
    id: "callerWillHonorOverdraft",
    label: "Caller will honor overdraft",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  [
    input.transactionMinor,
    input.observedAvailableMinor,
    input.callerNsfReturnFeeMinor,
    input.callerOverdraftFeeMinor,
  ].forEach((v) => money(v));
  const shortfall = Math.max(
    0,
    input.transactionMinor - input.observedAvailableMinor,
  );
  return {
    shortfallMinor: shortfall,
    modeledChosenFeeMinor: shortfall
      ? input.callerWillHonorOverdraft
        ? input.callerOverdraftFeeMinor
        : input.callerNsfReturnFeeMinor
      : 0,
    signedOverdraftMinusNsfFeeMinor:
      input.callerOverdraftFeeMinor - input.callerNsfReturnFeeMinor,
    modeledPaymentHonored: !shortfall || input.callerWillHonorOverdraft,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  transactionMinor: 1000,
  observedAvailableMinor: 500,
  callerNsfReturnFeeMinor: 100,
  callerOverdraftFeeMinor: 200,
  callerWillHonorOverdraft: true,
} satisfies Input;
export const exampleOutput = {
  shortfallMinor: 500,
  modeledChosenFeeMinor: 200,
  signedOverdraftMinusNsfFeeMinor: 100,
  modeledPaymentHonored: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/nsf-return-vs-overdraft-compare-lookup",
  title: "NSF Return vs Overdraft Compare Lookup",
  description:
    "Compare explicit NSF-return versus honored-overdraft scenario charges and shortfall, distinct from posting-order simulation. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    { id: "shortfallMinor", label: "Shortfall minor", kind: "number" },
    {
      id: "modeledChosenFeeMinor",
      label: "Modeled chosen fee minor",
      kind: "number",
    },
    {
      id: "signedOverdraftMinusNsfFeeMinor",
      label: "Signed overdraft minus nsf fee minor",
      kind: "number",
    },
    {
      id: "modeledPaymentHonored",
      label: "Modeled payment honored",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      transactionMinor: value.transactionMinor as number,
      observedAvailableMinor: value.observedAvailableMinor as number,
      callerNsfReturnFeeMinor: value.callerNsfReturnFeeMinor as number,
      callerOverdraftFeeMinor: value.callerOverdraftFeeMinor as number,
      callerWillHonorOverdraft: value.callerWillHonorOverdraft as boolean,
    }),
});
export const run = tool.execute;
export default tool;
