import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedConcreteTemperaturesC: readonly number[];
  readonly callerFreezingThresholdC: number;
  readonly callerThawingThresholdC: number;
}>;
export type Output = Readonly<{
  readonly witnessedFreezeThawCycleCount: number;
  readonly unfinishedObservedFrozenPhase: boolean;
  readonly openingFrozenStateWithoutWarmWitness: boolean;
}>;
const inputFields = [
  {
    id: "observedConcreteTemperaturesC",
    label: "Observed concrete temperatures c",
    kind: "numberList",
  },
  {
    id: "callerFreezingThresholdC",
    label: "Caller freezing threshold c",
    kind: "number",
  },
  {
    id: "callerThawingThresholdC",
    label: "Caller thawing threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerFreezingThresholdC >= input.callerThawingThresholdC)
    simpleError("hysteresis", "Separate ordered freezing<thawing thresholds.");
  if (!input.observedConcreteTemperaturesC.length)
    simpleError("trace", "Nonempty actual temperature evidence.");
  let warmed = false,
    frozen = false,
    cycles = 0;
  const initial =
    input.observedConcreteTemperaturesC[0] <= input.callerFreezingThresholdC;
  for (const t of input.observedConcreteTemperaturesC) {
    if (t >= input.callerThawingThresholdC) {
      if (frozen) cycles++;
      frozen = false;
      warmed = true;
    } else if (t <= input.callerFreezingThresholdC && warmed) frozen = true;
  }
  return {
    witnessedFreezeThawCycleCount: cycles,
    unfinishedObservedFrozenPhase: frozen,
    openingFrozenStateWithoutWarmWitness: initial,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConcreteTemperaturesC: [2, -2, 1, -3],
  callerFreezingThresholdC: 0,
  callerThawingThresholdC: 1,
} satisfies Input;
export const exampleOutput = {
  witnessedFreezeThawCycleCount: 1,
  unfinishedObservedFrozenPhase: true,
  openingFrozenStateWithoutWarmWitness: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/concrete-freeze-thaw-cycles",
  title: "Concrete Freeze Thaw Cycles Calculator",
  description:
    "Count warm-witness→freeze→thaw observed hysteresis cycles, opening frozen state not invented into completed cycle, final frozen censoring explicit; not concrete freeze-thaw durability. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "witnessedFreezeThawCycleCount",
      label: "Witnessed freeze thaw cycle count",
      kind: "number",
    },
    {
      id: "unfinishedObservedFrozenPhase",
      label: "Unfinished observed frozen phase",
      kind: "boolean",
    },
    {
      id: "openingFrozenStateWithoutWarmWitness",
      label: "Opening frozen state without warm witness",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedConcreteTemperaturesC:
        value.observedConcreteTemperaturesC as readonly number[],
      callerFreezingThresholdC: value.callerFreezingThresholdC as number,
      callerThawingThresholdC: value.callerThawingThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
