import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  bounded,
  aligned,
  weightedMinor,
  ageBuckets,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly stockAgesDays: readonly number[];
  readonly stockCostsMinor: readonly number[];
  readonly callerInclusiveAgeEdges: readonly number[];
  readonly callerReserveBasisPointsByBand: readonly number[];
}>;
export type Output = Readonly<{
  readonly stockReserveMinor: readonly number[];
  readonly totalObsolescenceReserveMinor: number;
}>;
const inputFields = [
  { id: "stockAgesDays", label: "Stock ages days", kind: "numberList" },
  { id: "stockCostsMinor", label: "Stock costs minor", kind: "numberList" },
  {
    id: "callerInclusiveAgeEdges",
    label: "Caller inclusive age edges",
    kind: "numberList",
  },
  {
    id: "callerReserveBasisPointsByBand",
    label: "Caller reserve basis points by band",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stockCostsMinor.forEach((v) => money(v, "stockCostsMinor"));
  aligned(input.stockAgesDays, input.stockCostsMinor, "stockAgesDays");
  if (input.stockAgesDays.some((v) => v < 0))
    simpleError("ages", "Nonnegative observed stock ages required.");
  const indices = ageBuckets(
    input.stockAgesDays,
    input.callerInclusiveAgeEdges,
  );
  if (
    input.callerReserveBasisPointsByBand.length !==
    input.callerInclusiveAgeEdges.length + 1
  )
    simpleError(
      "policy",
      "One explicit reserve rate per band including overflow required.",
    );
  input.callerReserveBasisPointsByBand.forEach((v) =>
    bounded(v, "rate", 0, 10000),
  );
  const reserves = input.stockCostsMinor.map((v, i) =>
    weightedMinor(v, input.callerReserveBasisPointsByBand[indices[i]], 10000),
  );
  return {
    stockReserveMinor: reserves,
    totalObsolescenceReserveMinor: sumMoney(reserves),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stockAgesDays: [10, 100],
  stockCostsMinor: [1000, 1000],
  callerInclusiveAgeEdges: [30],
  callerReserveBasisPointsByBand: [0, 5000],
} satisfies Input;
export const exampleOutput = {
  stockReserveMinor: [0, 500],
  totalObsolescenceReserveMinor: 500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/obsolete-inventory-reserve-percent-lookup",
  title: "Obsolete Inventory Reserve Percent Lookup",
  description:
    "Apply versioned caller aging reserve bands to actual stock cost; no embedded industry obsolescence percentages or automatic physical impairment inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "stockReserveMinor",
      label: "Stock reserve minor",
      kind: "numberList",
    },
    {
      id: "totalObsolescenceReserveMinor",
      label: "Total obsolescence reserve minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stockAgesDays: value.stockAgesDays as readonly number[],
      stockCostsMinor: value.stockCostsMinor as readonly number[],
      callerInclusiveAgeEdges:
        value.callerInclusiveAgeEdges as readonly number[],
      callerReserveBasisPointsByBand:
        value.callerReserveBasisPointsByBand as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
