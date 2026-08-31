import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  positive,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly cassetteDenominationMinor: readonly number[];
  readonly observedCurrentNoteCounts: readonly number[];
  readonly forecastDispensedNoteCounts: readonly number[];
  readonly callerReserveNoteCounts: readonly number[];
  readonly cassetteNoteCapacities: readonly number[];
}>;
export type Output = Readonly<{
  readonly plannedRefillNoteCounts: readonly number[];
  readonly modeledPostDemandNoteCounts: readonly number[];
  readonly unfundedReserveOrDemandNoteCounts: readonly number[];
  readonly totalRefillCashMinor: number;
}>;
const inputFields = [
  {
    id: "cassetteDenominationMinor",
    label: "Cassette denomination minor",
    kind: "numberList",
  },
  {
    id: "observedCurrentNoteCounts",
    label: "Observed current note counts",
    kind: "numberList",
  },
  {
    id: "forecastDispensedNoteCounts",
    label: "Forecast dispensed note counts",
    kind: "numberList",
  },
  {
    id: "callerReserveNoteCounts",
    label: "Caller reserve note counts",
    kind: "numberList",
  },
  {
    id: "cassetteNoteCapacities",
    label: "Cassette note capacities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cassetteDenominationMinor.forEach((v) =>
    money(v, "cassetteDenominationMinor"),
  );
  aligned(
    input.cassetteDenominationMinor,
    input.observedCurrentNoteCounts,
    "cassetteDenominationMinor",
  );
  aligned(
    input.cassetteDenominationMinor,
    input.forecastDispensedNoteCounts,
    "cassetteDenominationMinor",
  );
  aligned(
    input.cassetteDenominationMinor,
    input.callerReserveNoteCounts,
    "cassetteDenominationMinor",
  );
  aligned(
    input.cassetteDenominationMinor,
    input.cassetteNoteCapacities,
    "cassetteDenominationMinor",
  );
  input.cassetteDenominationMinor.forEach((v) => positive(v, "denomination"));
  const refill: number[] = [],
    post: number[] = [],
    unfunded: number[] = [];
  input.cassetteNoteCapacities.forEach((cap, i) => {
    bounded(cap, "capacity", 1, 1000000);
    bounded(input.observedCurrentNoteCounts[i], "notes", 0, cap);
    bounded(input.forecastDispensedNoteCounts[i], "forecast", 0, 1000000);
    bounded(input.callerReserveNoteCounts[i], "reserve", 0, 1000000);
    const required = Math.max(
        0,
        input.forecastDispensedNoteCounts[i] +
          input.callerReserveNoteCounts[i] -
          input.observedCurrentNoteCounts[i],
      ),
      added = Math.min(required, cap - input.observedCurrentNoteCounts[i]);
    refill.push(added);
    post.push(
      input.observedCurrentNoteCounts[i] +
        added -
        input.forecastDispensedNoteCounts[i],
    );
    unfunded.push(required - added);
  });
  return {
    plannedRefillNoteCounts: refill,
    modeledPostDemandNoteCounts: post,
    unfundedReserveOrDemandNoteCounts: unfunded,
    totalRefillCashMinor: sumMoney(
      refill.map((v, i) =>
        money(v * input.cassetteDenominationMinor[i], "refillCash"),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cassetteDenominationMinor: [100, 500],
  observedCurrentNoteCounts: [10, 20],
  forecastDispensedNoteCounts: [12, 10],
  callerReserveNoteCounts: [3, 5],
  cassetteNoteCapacities: [100, 100],
} satisfies Input;
export const exampleOutput = {
  plannedRefillNoteCounts: [5, 0],
  modeledPostDemandNoteCounts: [3, 10],
  unfundedReserveOrDemandNoteCounts: [0, 0],
  totalRefillCashMinor: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/atm-cassette-replenishment-plan",
  title: "ATM Cassette Replenishment Plan Calculator",
  description:
    "Plan actual per-denomination ATM replenishment constrained by cassette capacity against caller note-demand/reserve forecast, preserving unfunded requirement and signed post-demand shortage; no demand prediction, cash transport authorization or denomination substitution.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedRefillNoteCounts",
      label: "Planned refill note counts",
      kind: "numberList",
    },
    {
      id: "modeledPostDemandNoteCounts",
      label: "Modeled post demand note counts",
      kind: "numberList",
    },
    {
      id: "unfundedReserveOrDemandNoteCounts",
      label: "Unfunded reserve or demand note counts",
      kind: "numberList",
    },
    {
      id: "totalRefillCashMinor",
      label: "Total refill cash minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cassetteDenominationMinor:
        value.cassetteDenominationMinor as readonly number[],
      observedCurrentNoteCounts:
        value.observedCurrentNoteCounts as readonly number[],
      forecastDispensedNoteCounts:
        value.forecastDispensedNoteCounts as readonly number[],
      callerReserveNoteCounts:
        value.callerReserveNoteCounts as readonly number[],
      cassetteNoteCapacities: value.cassetteNoteCapacities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
