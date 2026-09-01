import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedRaceDistancesKm: readonly number[];
  readonly observedRaceTimesMinutes: readonly number[];
  readonly queryRaceDistanceKm: number;
  readonly callerRiegelExponents: readonly number[];
}>;
export type Output = Readonly<{
  readonly predictedRaceMinutesFromEachObservation: readonly number[];
  readonly predictionSpreadMinutes: number;
}>;
const inputFields = [
  {
    id: "observedRaceDistancesKm",
    label: "Observed race distances km",
    kind: "numberList",
  },
  {
    id: "observedRaceTimesMinutes",
    label: "Observed race times minutes",
    kind: "numberList",
  },
  {
    id: "queryRaceDistanceKm",
    label: "Query race distance km",
    kind: "number",
  },
  {
    id: "callerRiegelExponents",
    label: "Caller riegel exponents",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRaceDistancesKm.forEach((v) =>
    positive(v, "observedRaceDistancesKm"),
  );
  input.observedRaceTimesMinutes.forEach((v) =>
    positive(v, "observedRaceTimesMinutes"),
  );
  positive(input.queryRaceDistanceKm, "queryRaceDistanceKm");
  input.callerRiegelExponents.forEach((v) =>
    positive(v, "callerRiegelExponents"),
  );
  aligned(
    input.observedRaceDistancesKm,
    input.observedRaceTimesMinutes,
    "observedRaceDistancesKm",
  );
  aligned(
    input.observedRaceDistancesKm,
    input.callerRiegelExponents,
    "observedRaceDistancesKm",
  );
  const predictions = input.observedRaceDistancesKm.map(
    (v, i) =>
      input.observedRaceTimesMinutes[i] *
      (input.queryRaceDistanceKm / v) ** input.callerRiegelExponents[i],
  );
  return {
    predictedRaceMinutesFromEachObservation: predictions,
    predictionSpreadMinutes:
      Math.max(...predictions) - Math.min(...predictions),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRaceDistancesKm: [5, 10],
  observedRaceTimesMinutes: [20, 42],
  queryRaceDistanceKm: 21.1,
  callerRiegelExponents: [1.06, 1.06],
} satisfies Input;
export const exampleOutput = {
  predictedRaceMinutesFromEachObservation: [
    92.01554307851522, 92.68056934022022,
  ],
  predictionSpreadMinutes: 0.6650262617049947,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/riegel-race-prediction",
  title: "Riegel Race Time Prediction Calculator",
  description:
    "Riegel race extrapolation scenarios from actual race histories and caller fatigue exponents; predictions not pacing advice, health assessment or guaranteed endurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedRaceMinutesFromEachObservation",
      label: "Predicted race minutes from each observation",
      kind: "numberList",
    },
    {
      id: "predictionSpreadMinutes",
      label: "Prediction spread minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRaceDistancesKm:
        value.observedRaceDistancesKm as readonly number[],
      observedRaceTimesMinutes:
        value.observedRaceTimesMinutes as readonly number[],
      queryRaceDistanceKm: value.queryRaceDistanceKm as number,
      callerRiegelExponents: value.callerRiegelExponents as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
