import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  bounded,
  aligned,
  shape,
  sumMoney,
  roundMinor,
  unique,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly lotIds: readonly string[];
  readonly metalIds: readonly string[];
  readonly independentlyAssayedContainedMetalMgByLot: readonly (readonly number[])[];
  readonly callerSameCurrencySpotMinorPerGram: readonly number[];
  readonly callerRecoverableMetalBasisPoints: readonly number[];
  readonly callerLotRefiningFeesMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly roundedRecoverableMetalValuesMinorByLot: readonly (readonly number[])[];
  readonly netLotMetalValuesMinor: readonly number[];
  readonly aggregateNetMeltValueMinor: number;
}>;
const inputFields = [
  { id: "lotIds", label: "Lot ids", kind: "stringList" },
  { id: "metalIds", label: "Metal ids", kind: "stringList" },
  {
    id: "independentlyAssayedContainedMetalMgByLot",
    label: "Independently assayed contained metal mg by lot",
    kind: "matrix",
  },
  {
    id: "callerSameCurrencySpotMinorPerGram",
    label: "Caller same currency spot minor per gram",
    kind: "numberList",
  },
  {
    id: "callerRecoverableMetalBasisPoints",
    label: "Caller recoverable metal basis points",
    kind: "numberList",
  },
  {
    id: "callerLotRefiningFeesMinor",
    label: "Caller lot refining fees minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.lotIds, "lots");
  unique(input.metalIds, "metals");
  const width = shape(
    input.independentlyAssayedContainedMetalMgByLot,
    "assays",
  );
  if (width !== input.metalIds.length)
    simpleError(
      "assays",
      "One independently assayed metal column per ID required.",
    );
  aligned(
    input.lotIds,
    input.independentlyAssayedContainedMetalMgByLot,
    "lots",
  );
  aligned(input.metalIds, input.callerSameCurrencySpotMinorPerGram, "metals");
  aligned(input.metalIds, input.callerRecoverableMetalBasisPoints, "metals");
  aligned(input.lotIds, input.callerLotRefiningFeesMinor, "lots");
  input.independentlyAssayedContainedMetalMgByLot.forEach((r) =>
    r.forEach((v) => bounded(v, "metalMg", 0, 1000000000)),
  );
  input.callerSameCurrencySpotMinorPerGram.forEach((v) =>
    bounded(v, "price", 0, 1000000000),
  );
  input.callerRecoverableMetalBasisPoints.forEach((v) =>
    bounded(v, "recovery", 0, 10000),
  );
  input.callerLotRefiningFeesMinor.forEach((v) =>
    bounded(v, "fee", 0, 1000000000),
  );
  const values = input.independentlyAssayedContainedMetalMgByLot.map((r) =>
      r.map((v, j) =>
        roundMinor(
          BigInt(v) *
            BigInt(input.callerSameCurrencySpotMinorPerGram[j]) *
            BigInt(input.callerRecoverableMetalBasisPoints[j]),
          10000000n,
        ),
      ),
    ),
    net = values.map((r, i) =>
      integer(sumMoney(r) - input.callerLotRefiningFeesMinor[i], "netLot"),
    );
  const total = net.reduce((s, v) => s + BigInt(v), 0n);
  return {
    roundedRecoverableMetalValuesMinorByLot: values,
    netLotMetalValuesMinor: net,
    aggregateNetMeltValueMinor: integer(Number(total), "aggregateNet"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lotIds: ["a", "b"],
  metalIds: ["gold", "silver"],
  independentlyAssayedContainedMetalMgByLot: [
    [1000, 2000],
    [0, 3000],
  ],
  callerSameCurrencySpotMinorPerGram: [1000, 100],
  callerRecoverableMetalBasisPoints: [9000, 10000],
  callerLotRefiningFeesMinor: [50, 25],
} satisfies Input;
export const exampleOutput = {
  roundedRecoverableMetalValuesMinorByLot: [
    [900, 200],
    [0, 300],
  ],
  netLotMetalValuesMinor: [1050, 275],
  aggregateNetMeltValueMinor: 1325,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/scrap-lot-aggregate-melt-value",
  title: "Scrap Lot Aggregate Melt Value Calculator",
  description:
    "Reconcile actual independent lot×metal assay, caller recoverability/spot and per-lot fees using exact BigInt rational rounding in one currency; not scalar average of known lot value, price lookup, investment or assay authenticity.",
  inputs: inputFields,
  outputs: [
    {
      id: "roundedRecoverableMetalValuesMinorByLot",
      label: "Rounded recoverable metal values minor by lot",
      kind: "matrix",
    },
    {
      id: "netLotMetalValuesMinor",
      label: "Net lot metal values minor",
      kind: "numberList",
    },
    {
      id: "aggregateNetMeltValueMinor",
      label: "Aggregate net melt value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lotIds: value.lotIds as readonly string[],
      metalIds: value.metalIds as readonly string[],
      independentlyAssayedContainedMetalMgByLot:
        value.independentlyAssayedContainedMetalMgByLot as readonly (readonly number[])[],
      callerSameCurrencySpotMinorPerGram:
        value.callerSameCurrencySpotMinorPerGram as readonly number[],
      callerRecoverableMetalBasisPoints:
        value.callerRecoverableMetalBasisPoints as readonly number[],
      callerLotRefiningFeesMinor:
        value.callerLotRefiningFeesMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
