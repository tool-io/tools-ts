import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly drilledMetersByBit: readonly number[];
  readonly bitCosts: readonly number[];
  readonly remainingWearFraction: number;
}>;
export type Output = Readonly<{
  readonly meanObservedLifeMeters: number;
  readonly pooledBitCostPerMeter: number;
  readonly estimatedRemainingMeters: number;
}>;
const inputFields = [
  {
    id: "drilledMetersByBit",
    label: "Drilled meters by bit",
    kind: "numberList",
  },
  { id: "bitCosts", label: "Bit costs", kind: "numberList" },
  {
    id: "remainingWearFraction",
    label: "Remaining wear fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.drilledMetersByBit.forEach((v) => positive(v, "drilledMetersByBit"));
  input.bitCosts.forEach((v) => nonnegative(v, "bitCosts"));
  fraction(input.remainingWearFraction, "remainingWearFraction");
  aligned(input.drilledMetersByBit, input.bitCosts, "drilledMetersByBit");
  const meanObservedLifeMeters = mean(input.drilledMetersByBit);
  return {
    meanObservedLifeMeters,
    pooledBitCostPerMeter:
      input.bitCosts.reduce((a, b) => a + b, 0) /
      input.drilledMetersByBit.reduce((a, b) => a + b, 0),
    estimatedRemainingMeters:
      meanObservedLifeMeters * input.remainingWearFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  drilledMetersByBit: [100, 200, 300],
  bitCosts: [50, 70, 90],
  remainingWearFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  meanObservedLifeMeters: 200,
  pooledBitCostPerMeter: 0.35,
  estimatedRemainingMeters: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/drill-bit-life",
  title: "Drill Bit Life",
  description:
    "Summarize completed bit lives, pooled cost/meter and caller linear-wear scenario; censored bits and nonlinear wear are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "meanObservedLifeMeters",
      label: "Mean observed life meters",
      kind: "number",
    },
    {
      id: "pooledBitCostPerMeter",
      label: "Pooled bit cost per meter",
      kind: "number",
    },
    {
      id: "estimatedRemainingMeters",
      label: "Estimated remaining meters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      drilledMetersByBit: value.drilledMetersByBit as readonly number[],
      bitCosts: value.bitCosts as readonly number[],
      remainingWearFraction: value.remainingWearFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
