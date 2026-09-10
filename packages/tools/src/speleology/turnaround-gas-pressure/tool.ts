import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualRecordedStartingPressureBar: number;
  readonly callerIndependentlyApprovedOutboundPressureBudgetBar: number;
  readonly callerIndependentlyApprovedReservePressureBar: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualRecordedStartingPressureBar",
    label: "Actual recorded starting pressure bar",
    kind: "number",
  },
  {
    id: "callerIndependentlyApprovedOutboundPressureBudgetBar",
    label: "Caller independently approved outbound pressure budget bar",
    kind: "number",
  },
  {
    id: "callerIndependentlyApprovedReservePressureBar",
    label: "Caller independently approved reserve pressure bar",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.actualRecordedStartingPressureBar,
    input.callerIndependentlyApprovedOutboundPressureBudgetBar,
    input.callerIndependentlyApprovedReservePressureBar,
  ].forEach((v) => nonnegative(v, "pressure"));
  if (
    input.callerIndependentlyApprovedOutboundPressureBudgetBar >
    input.actualRecordedStartingPressureBar
  )
    simpleError(
      "pressure",
      "Recorded consumption budget within actual starting pressure.",
    );
  const p =
    input.actualRecordedStartingPressureBar -
    input.callerIndependentlyApprovedOutboundPressureBudgetBar;
  return {
    conditionalRecordedTurnPressureBar: p,
    signedTurnMinusCallerReserveBar:
      p - input.callerIndependentlyApprovedReservePressureBar,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualRecordedStartingPressureBar: 200,
    callerIndependentlyApprovedOutboundPressureBudgetBar: 60,
    callerIndependentlyApprovedReservePressureBar: 80,
  },
  output: {
    result: {
      conditionalRecordedTurnPressureBar: 140,
      signedTurnMinusCallerReserveBar: 60,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/turnaround-gas-pressure",
  title: "Turnaround Gas Pressure Calculator",
  description:
    "Reconcile actual starting pressure minus independently qualified outbound pressure budget, retain signed difference to approved reserve. Does not choose thirds, gas plan, turn trigger or safe cave-dive/decompression limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
