import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly measuredBerryDiametersMm: readonly number[];
  readonly callerSmallBerryDiameterThresholdMm: number;
  readonly assessableBerryFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly smallBerryPercentAmongAssessed: number;
  readonly assessableBerryCount: number;
  readonly unassessedBerryCount: number;
}>;
const inputFields = [
  {
    id: "measuredBerryDiametersMm",
    label: "Measured berry diameters mm",
    kind: "numberList",
  },
  {
    id: "callerSmallBerryDiameterThresholdMm",
    label: "Caller small berry diameter threshold mm",
    kind: "number",
  },
  {
    id: "assessableBerryFlags",
    label: "Assessable berry flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSmallBerryDiameterThresholdMm,
    "callerSmallBerryDiameterThresholdMm",
  );
  input.measuredBerryDiametersMm.forEach((v) =>
    nonnegative(v, "measuredBerryDiametersMm"),
  );
  aligned(
    input.measuredBerryDiametersMm,
    input.assessableBerryFlags,
    "measuredBerryDiametersMm",
  );
  binary(input.assessableBerryFlags, "assessable");
  const assessableBerryCount = positive(
      input.assessableBerryFlags.reduce((a, b) => a + b, 0),
      "assessed",
    ),
    small = input.measuredBerryDiametersMm.reduce(
      (s, v, i) =>
        s +
        (v < input.callerSmallBerryDiameterThresholdMm
          ? input.assessableBerryFlags[i]
          : 0),
      0,
    );
  return {
    smallBerryPercentAmongAssessed: (100 * small) / assessableBerryCount,
    assessableBerryCount,
    unassessedBerryCount:
      input.measuredBerryDiametersMm.length - assessableBerryCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredBerryDiametersMm: [5, 10, 5, 10],
  callerSmallBerryDiameterThresholdMm: 7,
  assessableBerryFlags: [1, 1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  smallBerryPercentAmongAssessed: 66.66666666666667,
  assessableBerryCount: 3,
  unassessedBerryCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/millerandage-hens-chicks-percent",
  title: "Millerandage Hens Chicks Percent",
  description:
    "Count observed small berries under caller diameter policy with explicit assessable coverage; small berries alone do not establish millerandage, cause or commercial grade.",
  inputs: inputFields,
  outputs: [
    {
      id: "smallBerryPercentAmongAssessed",
      label: "Small berry percent among assessed",
      kind: "number",
    },
    {
      id: "assessableBerryCount",
      label: "Assessable berry count",
      kind: "number",
    },
    {
      id: "unassessedBerryCount",
      label: "Unassessed berry count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredBerryDiametersMm:
        value.measuredBerryDiametersMm as readonly number[],
      callerSmallBerryDiameterThresholdMm:
        value.callerSmallBerryDiameterThresholdMm as number,
      assessableBerryFlags: value.assessableBerryFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
