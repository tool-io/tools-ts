import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedPlantCountsByLoop: readonly number[];
  readonly measuredDailyPlantDrawLiters: readonly number[];
  readonly callerAutonomyDays: number;
  readonly loopFixedHoldUpLiters: readonly number[];
  readonly callerUsableTankFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredUsableReservoirLitersByLoop: readonly number[];
  readonly requiredNominalReservoirLitersByLoop: readonly number[];
  readonly combinedRequiredNominalLiters: number;
}>;
const inputFields = [
  {
    id: "observedPlantCountsByLoop",
    label: "Observed plant counts by loop",
    kind: "numberList",
  },
  {
    id: "measuredDailyPlantDrawLiters",
    label: "Measured daily plant draw liters",
    kind: "numberList",
  },
  { id: "callerAutonomyDays", label: "Caller autonomy days", kind: "number" },
  {
    id: "loopFixedHoldUpLiters",
    label: "Loop fixed hold up liters",
    kind: "numberList",
  },
  {
    id: "callerUsableTankFraction",
    label: "Caller usable tank fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerUsableTankFraction, "callerUsableTankFraction");
  input.measuredDailyPlantDrawLiters.forEach((v) =>
    nonnegative(v, "measuredDailyPlantDrawLiters"),
  );
  nonnegative(input.callerAutonomyDays, "callerAutonomyDays");
  input.loopFixedHoldUpLiters.forEach((v) =>
    nonnegative(v, "loopFixedHoldUpLiters"),
  );
  fraction(input.callerUsableTankFraction, "callerUsableTankFraction");
  aligned(
    input.observedPlantCountsByLoop,
    input.measuredDailyPlantDrawLiters,
    "observedPlantCountsByLoop",
  );
  aligned(
    input.observedPlantCountsByLoop,
    input.loopFixedHoldUpLiters,
    "observedPlantCountsByLoop",
  );
  input.observedPlantCountsByLoop.forEach((v) =>
    bounded(v, "plants", 0, 1000000),
  );
  const usable = input.observedPlantCountsByLoop.map(
      (v, i) =>
        v * input.measuredDailyPlantDrawLiters[i] * input.callerAutonomyDays +
        input.loopFixedHoldUpLiters[i],
    ),
    nominal = usable.map((v) => v / input.callerUsableTankFraction);
  return {
    requiredUsableReservoirLitersByLoop: usable,
    requiredNominalReservoirLitersByLoop: nominal,
    combinedRequiredNominalLiters: sum(nominal),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPlantCountsByLoop: [10, 20],
  measuredDailyPlantDrawLiters: [0.2, 0.1],
  callerAutonomyDays: 3,
  loopFixedHoldUpLiters: [2, 3],
  callerUsableTankFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  requiredUsableReservoirLitersByLoop: [8, 9],
  requiredNominalReservoirLitersByLoop: [10, 11.25],
  combinedRequiredNominalLiters: 21.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/hydroponic-reservoir-size-plants",
  title: "Hydroponic Reservoir Size Plants Calculator",
  description:
    "Budget independently measured plant draw and fixed loop hold-up over caller autonomy/usable tank fraction; no universal liters/plant, root oxygen or hydraulic sizing certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredUsableReservoirLitersByLoop",
      label: "Required usable reservoir liters by loop",
      kind: "numberList",
    },
    {
      id: "requiredNominalReservoirLitersByLoop",
      label: "Required nominal reservoir liters by loop",
      kind: "numberList",
    },
    {
      id: "combinedRequiredNominalLiters",
      label: "Combined required nominal liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPlantCountsByLoop:
        value.observedPlantCountsByLoop as readonly number[],
      measuredDailyPlantDrawLiters:
        value.measuredDailyPlantDrawLiters as readonly number[],
      callerAutonomyDays: value.callerAutonomyDays as number,
      loopFixedHoldUpLiters: value.loopFixedHoldUpLiters as readonly number[],
      callerUsableTankFraction: value.callerUsableTankFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
