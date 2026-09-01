import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  catalogIndex,
  band,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerRootstockLotIds: readonly string[];
  readonly callerMinimumCuttingLengthCm: readonly number[];
  readonly callerMaximumCuttingLengthCm: readonly number[];
  readonly queryRootstockLotId: string;
  readonly observedCuttingLengthsCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerCuttingLengthRangeCm: readonly number[];
  readonly cuttingsOutsideCallerLengthPolicyIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerRootstockLotIds",
    label: "Caller rootstock lot ids",
    kind: "stringList",
  },
  {
    id: "callerMinimumCuttingLengthCm",
    label: "Caller minimum cutting length cm",
    kind: "numberList",
  },
  {
    id: "callerMaximumCuttingLengthCm",
    label: "Caller maximum cutting length cm",
    kind: "numberList",
  },
  {
    id: "queryRootstockLotId",
    label: "Query rootstock lot id",
    kind: "string",
  },
  {
    id: "observedCuttingLengthsCm",
    label: "Observed cutting lengths cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMinimumCuttingLengthCm.forEach((v) =>
    positive(v, "callerMinimumCuttingLengthCm"),
  );
  input.callerMaximumCuttingLengthCm.forEach((v) =>
    positive(v, "callerMaximumCuttingLengthCm"),
  );
  input.observedCuttingLengthsCm.forEach((v) =>
    positive(v, "observedCuttingLengthsCm"),
  );
  aligned(
    input.callerRootstockLotIds,
    input.callerMinimumCuttingLengthCm,
    "callerRootstockLotIds",
  );
  aligned(
    input.callerRootstockLotIds,
    input.callerMaximumCuttingLengthCm,
    "callerRootstockLotIds",
  );
  const i = catalogIndex(
      input.callerRootstockLotIds,
      input.queryRootstockLotId,
    ),
    lo = input.callerMinimumCuttingLengthCm[i],
    hi = input.callerMaximumCuttingLengthCm[i];
  band(0, lo, hi);
  return {
    callerCuttingLengthRangeCm: [lo, hi],
    cuttingsOutsideCallerLengthPolicyIndices:
      input.observedCuttingLengthsCm.flatMap((v, j) =>
        band(v, lo, hi) < 0 ? [j] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRootstockLotIds: ["a", "b"],
  callerMinimumCuttingLengthCm: [25, 30],
  callerMaximumCuttingLengthCm: [35, 40],
  queryRootstockLotId: "a",
  observedCuttingLengthsCm: [24, 30, 36],
} satisfies Input;
export const exampleOutput = {
  callerCuttingLengthRangeCm: [25, 35],
  cuttingsOutsideCallerLengthPolicyIndices: [0, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/rootstock-cutting-length-standard-lookup",
  title: "Rootstock Cutting Length Standard Lookup",
  description:
    "Audit actual measured rootstock cutting lengths against exact caller verified lot band; no universal cutting length, inferred node viability or existing scion usable-bud geometry.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerCuttingLengthRangeCm",
      label: "Caller cutting length range cm",
      kind: "numberList",
    },
    {
      id: "cuttingsOutsideCallerLengthPolicyIndices",
      label: "Cuttings outside caller length policy indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerRootstockLotIds: value.callerRootstockLotIds as readonly string[],
      callerMinimumCuttingLengthCm:
        value.callerMinimumCuttingLengthCm as readonly number[],
      callerMaximumCuttingLengthCm:
        value.callerMaximumCuttingLengthCm as readonly number[],
      queryRootstockLotId: value.queryRootstockLotId as string,
      observedCuttingLengthsCm:
        value.observedCuttingLengthsCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
