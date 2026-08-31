import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
  bounded,
  aligned,
  binary,
  weightedMinor,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerEligibleAssetValuesMinor: readonly number[];
  readonly callerAssetHaircutBasisPoints: readonly number[];
  readonly levelTwoFlags: readonly number[];
  readonly callerLevelTwoShareCapBasisPoints: number;
  readonly observedStressOutflowsMinor: number;
  readonly observedStressInflowsMinor: number;
  readonly callerInflowOffsetCapBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly callerAdjustedEligibleHqlaMinor: number;
  readonly cappedStressInflowsMinor: number;
  readonly netStressCashOutflowsMinor: number;
  readonly modeledLcrPercent: number;
}>;
const inputFields = [
  {
    id: "callerEligibleAssetValuesMinor",
    label: "Caller eligible asset values minor",
    kind: "numberList",
  },
  {
    id: "callerAssetHaircutBasisPoints",
    label: "Caller asset haircut basis points",
    kind: "numberList",
  },
  { id: "levelTwoFlags", label: "Level two flags", kind: "numberList" },
  {
    id: "callerLevelTwoShareCapBasisPoints",
    label: "Caller level two share cap basis points",
    kind: "number",
  },
  {
    id: "observedStressOutflowsMinor",
    label: "Observed stress outflows minor",
    kind: "number",
  },
  {
    id: "observedStressInflowsMinor",
    label: "Observed stress inflows minor",
    kind: "number",
  },
  {
    id: "callerInflowOffsetCapBasisPoints",
    label: "Caller inflow offset cap basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerEligibleAssetValuesMinor.forEach((v) =>
    money(v, "callerEligibleAssetValuesMinor"),
  );
  money(input.observedStressOutflowsMinor, "observedStressOutflowsMinor");
  money(input.observedStressInflowsMinor, "observedStressInflowsMinor");
  binary(input.levelTwoFlags, "levelTwoFlags");
  aligned(
    input.callerEligibleAssetValuesMinor,
    input.callerAssetHaircutBasisPoints,
    "callerEligibleAssetValuesMinor",
  );
  aligned(
    input.callerEligibleAssetValuesMinor,
    input.levelTwoFlags,
    "callerEligibleAssetValuesMinor",
  );
  input.callerAssetHaircutBasisPoints.forEach((v) =>
    bounded(v, "haircut", 0, 10000),
  );
  bounded(input.callerLevelTwoShareCapBasisPoints, "levelTwoCap", 0, 9999);
  bounded(input.callerInflowOffsetCapBasisPoints, "inflowCap", 0, 9999);
  const adjusted = input.callerEligibleAssetValuesMinor.map((v, i) =>
      weightedMinor(v, 10000 - input.callerAssetHaircutBasisPoints[i], 10000),
    ),
    levelOne = sumMoney(adjusted.filter((_, i) => !input.levelTwoFlags[i])),
    levelTwo = sumMoney(
      adjusted.filter((_, i) => input.levelTwoFlags[i] === 1),
    ),
    maxTwo =
      (BigInt(levelOne) * BigInt(input.callerLevelTwoShareCapBasisPoints)) /
      BigInt(10000 - input.callerLevelTwoShareCapBasisPoints),
    cappedLevelTwo = Number(
      BigInt(levelTwo) < maxTwo ? BigInt(levelTwo) : maxTwo,
    ),
    hqla = sumMoney([levelOne, cappedLevelTwo]),
    maxInflow = integer(
      Number(
        (BigInt(input.observedStressOutflowsMinor) *
          BigInt(input.callerInflowOffsetCapBasisPoints)) /
          10000n,
      ),
      "inflowCap",
    ),
    inflow = Math.min(input.observedStressInflowsMinor, maxInflow),
    net = positive(input.observedStressOutflowsMinor - inflow, "netOutflows");
  return {
    callerAdjustedEligibleHqlaMinor: hqla,
    cappedStressInflowsMinor: inflow,
    netStressCashOutflowsMinor: net,
    modeledLcrPercent: (100 * hqla) / net,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEligibleAssetValuesMinor: [1000, 1000],
  callerAssetHaircutBasisPoints: [0, 2000],
  levelTwoFlags: [0, 1],
  callerLevelTwoShareCapBasisPoints: 4000,
  observedStressOutflowsMinor: 2000,
  observedStressInflowsMinor: 1500,
  callerInflowOffsetCapBasisPoints: 7500,
} satisfies Input;
export const exampleOutput = {
  callerAdjustedEligibleHqlaMinor: 1666,
  cappedStressInflowsMinor: 1500,
  netStressCashOutflowsMinor: 500,
  modeledLcrPercent: 333.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/lcr-liquidity-coverage-ratio",
  title: "LCR Liquidity Coverage Ratio Calculator",
  description:
    "Model caller classified LCR eligible asset haircuts, aggregate level-two share cap and stress inflow offset cap with floor-rounded hard caps; not complete Basel rules, level-2B subcaps/unwind, supervisory liquidity sufficiency or regulatory compliance.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAdjustedEligibleHqlaMinor",
      label: "Caller adjusted eligible hqla minor",
      kind: "number",
    },
    {
      id: "cappedStressInflowsMinor",
      label: "Capped stress inflows minor",
      kind: "number",
    },
    {
      id: "netStressCashOutflowsMinor",
      label: "Net stress cash outflows minor",
      kind: "number",
    },
    { id: "modeledLcrPercent", label: "Modeled lcr percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerEligibleAssetValuesMinor:
        value.callerEligibleAssetValuesMinor as readonly number[],
      callerAssetHaircutBasisPoints:
        value.callerAssetHaircutBasisPoints as readonly number[],
      levelTwoFlags: value.levelTwoFlags as readonly number[],
      callerLevelTwoShareCapBasisPoints:
        value.callerLevelTwoShareCapBasisPoints as number,
      observedStressOutflowsMinor: value.observedStressOutflowsMinor as number,
      observedStressInflowsMinor: value.observedStressInflowsMinor as number,
      callerInflowOffsetCapBasisPoints:
        value.callerInflowOffsetCapBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
