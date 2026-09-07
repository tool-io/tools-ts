import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  integer,
  aligned,
  sum,
  money,
  signedSum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly lotUnitCounts: readonly number[];
  readonly callerLotCostPerUnitMinor: readonly number[];
  readonly disposalUnitCount: number;
  readonly netDisposalProceedsMinor: number;
}>;
export type Output = Readonly<{
  readonly fifoUsedLotUnits: readonly number[];
  readonly hifoUsedLotUnits: readonly number[];
  readonly fifoBasisMinor: number;
  readonly hifoBasisMinor: number;
  readonly fifoGainMinor: number;
  readonly hifoGainMinor: number;
}>;
const inputFields = [
  { id: "lotUnitCounts", label: "Lot unit counts", kind: "numberList" },
  {
    id: "callerLotCostPerUnitMinor",
    label: "Caller lot cost per unit minor",
    kind: "numberList",
  },
  { id: "disposalUnitCount", label: "Disposal unit count", kind: "number" },
  {
    id: "netDisposalProceedsMinor",
    label: "Net disposal proceeds minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerLotCostPerUnitMinor.forEach((v) =>
    money(v, "callerLotCostPerUnitMinor"),
  );
  money(input.netDisposalProceedsMinor, "netDisposalProceedsMinor");
  aligned(
    input.lotUnitCounts,
    input.callerLotCostPerUnitMinor,
    "lotUnitCounts",
  );
  if (input.lotUnitCounts.length > 128)
    simpleError(
      "lots",
      "≤128 independently tax-eligible original chronological acquisition lots, exact common indivisible unit scale.",
    );
  input.lotUnitCounts.forEach((v) => bounded(v, "units", 1, 1000000000));
  bounded(input.disposalUnitCount, "disposal", 0, 1000000000);
  if (input.disposalUnitCount > sum(input.lotUnitCounts))
    simpleError("units", "Insufficient lots.");
  const alloc = (order: number[]) => {
    let left = input.disposalUnitCount;
    const u = input.lotUnitCounts.map(() => 0);
    for (const i of order) {
      u[i] = Math.min(left, input.lotUnitCounts[i]);
      left -= u[i];
    }
    const cost = u.reduce(
      (s, v, i) => s + BigInt(v) * BigInt(input.callerLotCostPerUnitMinor[i]),
      0n,
    );
    return { units: u, basis: integer(Number(cost), "basis") };
  };
  const indices = input.lotUnitCounts.map((_, i) => i),
    fifo = alloc(indices),
    hifo = alloc(
      [...indices].sort(
        (a, b) =>
          input.callerLotCostPerUnitMinor[b] -
            input.callerLotCostPerUnitMinor[a] || a - b,
      ),
    );
  return {
    fifoUsedLotUnits: fifo.units,
    hifoUsedLotUnits: hifo.units,
    fifoBasisMinor: fifo.basis,
    hifoBasisMinor: hifo.basis,
    fifoGainMinor: signedSum([input.netDisposalProceedsMinor, -fifo.basis]),
    hifoGainMinor: signedSum([input.netDisposalProceedsMinor, -hifo.basis]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lotUnitCounts: [2, 2],
  callerLotCostPerUnitMinor: [10, 20],
  disposalUnitCount: 3,
  netDisposalProceedsMinor: 100,
} satisfies Input;
export const exampleOutput = {
  fifoUsedLotUnits: [2, 1],
  hifoUsedLotUnits: [1, 2],
  fifoBasisMinor: 40,
  hifoBasisMinor: 50,
  fifoGainMinor: 60,
  hifoGainMinor: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/crypto-cost-basis-method-hifo-comparison",
  title: "Crypto Cost Basis Method HIFO Comparison Tool",
  description:
    "Exact bounded crypto FIFO/HIFO lot allocation comparison, chronological tie-break; independently permitted specific identification/account basis external, no fractions beyond common unit scale. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "fifoUsedLotUnits",
      label: "Fifo used lot units",
      kind: "numberList",
    },
    {
      id: "hifoUsedLotUnits",
      label: "Hifo used lot units",
      kind: "numberList",
    },
    { id: "fifoBasisMinor", label: "Fifo basis minor", kind: "number" },
    { id: "hifoBasisMinor", label: "Hifo basis minor", kind: "number" },
    { id: "fifoGainMinor", label: "Fifo gain minor", kind: "number" },
    { id: "hifoGainMinor", label: "Hifo gain minor", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      lotUnitCounts: value.lotUnitCounts as readonly number[],
      callerLotCostPerUnitMinor:
        value.callerLotCostPerUnitMinor as readonly number[],
      disposalUnitCount: value.disposalUnitCount as number,
      netDisposalProceedsMinor: value.netDisposalProceedsMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
