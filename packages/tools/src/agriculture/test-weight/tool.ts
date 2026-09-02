import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFullTestCupMassKg: readonly number[];
  readonly matchedEmptyTestCupMassKg: readonly number[];
  readonly callerCalibratedTestCupVolumeLiters: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledGrainTestWeightKgHectoliter: number;
}>;
const inputFields = [
  {
    id: "observedFullTestCupMassKg",
    label: "Observed full test cup mass kg",
    kind: "numberList",
  },
  {
    id: "matchedEmptyTestCupMassKg",
    label: "Matched empty test cup mass kg",
    kind: "numberList",
  },
  {
    id: "callerCalibratedTestCupVolumeLiters",
    label: "Caller calibrated test cup volume liters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCalibratedTestCupVolumeLiters.forEach((v) =>
    positive(v, "callerCalibratedTestCupVolumeLiters"),
  );
  input.observedFullTestCupMassKg.forEach((v) =>
    nonnegative(v, "observedFullTestCupMassKg"),
  );
  input.matchedEmptyTestCupMassKg.forEach((v) =>
    nonnegative(v, "matchedEmptyTestCupMassKg"),
  );
  aligned(
    input.observedFullTestCupMassKg,
    input.matchedEmptyTestCupMassKg,
    "observedFullTestCupMassKg",
  );
  aligned(
    input.observedFullTestCupMassKg,
    input.callerCalibratedTestCupVolumeLiters,
    "observedFullTestCupMassKg",
  );
  const net = input.observedFullTestCupMassKg.map((v, i) =>
    nonnegative(v - input.matchedEmptyTestCupMassKg[i], "grain net"),
  );
  return {
    pooledGrainTestWeightKgHectoliter:
      (100 * sum(net)) / sum(input.callerCalibratedTestCupVolumeLiters),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFullTestCupMassKg: [1, 2],
  matchedEmptyTestCupMassKg: [0.1, 0.2],
  callerCalibratedTestCupVolumeLiters: [1, 2],
} satisfies Input;
export const exampleOutput = {
  pooledGrainTestWeightKgHectoliter: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/test-weight",
  title: "Agriculture Test Weight Calculator",
  description:
    "Actual matched test cup gross/tare/verified volume measurements pooled in kg/hL, not assumed grain density/capacity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledGrainTestWeightKgHectoliter",
      label: "Pooled grain test weight kg hectoliter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFullTestCupMassKg:
        value.observedFullTestCupMassKg as readonly number[],
      matchedEmptyTestCupMassKg:
        value.matchedEmptyTestCupMassKg as readonly number[],
      callerCalibratedTestCupVolumeLiters:
        value.callerCalibratedTestCupVolumeLiters as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
