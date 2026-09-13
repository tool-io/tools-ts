import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
  splitMinor,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualDistributablePoolMinorUnits: number;
  readonly callerContractGpBasisPoints: number;
  readonly callerContractLpBasisPoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDistributablePoolMinorUnits",
    label: "Actual distributable pool minor units",
    kind: "number",
  },
  {
    id: "callerContractGpBasisPoints",
    label: "Caller contract gp basis points",
    kind: "number",
  },
  {
    id: "callerContractLpBasisPoints",
    label: "Caller contract lp basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.callerContractGpBasisPoints, "GP", 0, 10000);
  bounded(input.callerContractLpBasisPoints, "LP", 0, 10000);
  if (
    input.callerContractGpBasisPoints + input.callerContractLpBasisPoints !==
    10000
  )
    simpleError("shares", "ActualcompleteGP/LPshares.");
  const a = splitMinor(input.actualDistributablePoolMinorUnits, [
    input.callerContractGpBasisPoints,
    input.callerContractLpBasisPoints,
  ]);
  return { actualGpCashMinorUnits: a[0], actualLpCashMinorUnits: a[1] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDistributablePoolMinorUnits: 100,
    callerContractGpBasisPoints: 2000,
    callerContractLpBasisPoints: 8000,
  },
  output: {
    result: { actualGpCashMinorUnits: 20, actualLpCashMinorUnits: 80 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/gp-lp-split",
  title: "GP LP Split Calculator",
  description:
    "Actual completeGP/LP contract distribution after separately resolved priority/promote, no ownership terms determined; exactminorunitswithstableGP-first largest-remainder ties.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
