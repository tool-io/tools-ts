import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  ordered,
  maximum,
  minimum,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly testLiquidDensitiesGramsPerCm3: readonly number[];
  readonly observedFloatsFlags: readonly number[];
  readonly callerCandidateDensityBoundsGramsPerCm3: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedDensityBracketGramsPerCm3: readonly number[];
  readonly candidateDensityIntervalCompatible: boolean;
}>;
const inputFields = [
  {
    id: "testLiquidDensitiesGramsPerCm3",
    label: "Test liquid densities grams per cm3",
    kind: "numberList",
  },
  {
    id: "observedFloatsFlags",
    label: "Observed floats flags",
    kind: "numberList",
  },
  {
    id: "callerCandidateDensityBoundsGramsPerCm3",
    label: "Caller candidate density bounds grams per cm3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.testLiquidDensitiesGramsPerCm3.forEach((v) =>
    positive(v, "testLiquidDensitiesGramsPerCm3"),
  );
  input.callerCandidateDensityBoundsGramsPerCm3.forEach((v) =>
    positive(v, "callerCandidateDensityBoundsGramsPerCm3"),
  );
  ordered(input.testLiquidDensitiesGramsPerCm3, "liquids");
  aligned(
    input.testLiquidDensitiesGramsPerCm3,
    input.observedFloatsFlags,
    "observations",
  );
  binary(input.observedFloatsFlags, "floats");
  if (
    input.observedFloatsFlags.some(
      (v, i) => i > 0 && v < input.observedFloatsFlags[i - 1],
    ) ||
    input.callerCandidateDensityBoundsGramsPerCm3.length !== 2 ||
    input.callerCandidateDensityBoundsGramsPerCm3[1] <
      input.callerCandidateDensityBoundsGramsPerCm3[0]
  )
    simpleError(
      "density",
      "Consistent float transitions and ordered caller candidate interval required.",
    );
  const sink = input.testLiquidDensitiesGramsPerCm3.filter(
      (_, i) => input.observedFloatsFlags[i] === 0,
    ),
    float = input.testLiquidDensitiesGramsPerCm3.filter(
      (_, i) => input.observedFloatsFlags[i] === 1,
    );
  if (!sink.length || !float.length)
    simpleError("bracket", "Two-sided observed buoyancy bracket required.");
  const lo = maximum(sink),
    hi = minimum(float),
    a = input.callerCandidateDensityBoundsGramsPerCm3;
  return {
    observedDensityBracketGramsPerCm3: [lo, hi],
    candidateDensityIntervalCompatible: a[1] >= lo && a[0] <= hi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  testLiquidDensitiesGramsPerCm3: [1, 1.2],
  observedFloatsFlags: [0, 1],
  callerCandidateDensityBoundsGramsPerCm3: [1.05, 1.1],
} satisfies Input;
export const exampleOutput = {
  observedDensityBracketGramsPerCm3: [1, 1.2],
  candidateDensityIntervalCompatible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/amber-buoyancy-test",
  title: "Amber Buoyancy Quick Test",
  description:
    "Compare binary float/sink bracket to caller candidate density interval, without neutral-density readings; compatibility alone cannot identify amber, exclude resin/imitation or validate a preparation/handling method.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDensityBracketGramsPerCm3",
      label: "Observed density bracket grams per cm3",
      kind: "numberList",
    },
    {
      id: "candidateDensityIntervalCompatible",
      label: "Candidate density interval compatible",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      testLiquidDensitiesGramsPerCm3:
        value.testLiquidDensitiesGramsPerCm3 as readonly number[],
      observedFloatsFlags: value.observedFloatsFlags as readonly number[],
      callerCandidateDensityBoundsGramsPerCm3:
        value.callerCandidateDensityBoundsGramsPerCm3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
