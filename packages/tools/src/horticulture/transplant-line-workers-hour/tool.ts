import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedTransplantedPlantCounts: readonly number[];
  readonly observedWorkerCounts: readonly number[];
  readonly observedSessionHours: readonly number[];
  readonly callerRemainingPlantCount: number;
}>;
export type Output = Readonly<{
  readonly pooledPlantsPerWorkerHour: number;
  readonly estimatedRemainingWorkerHours: number;
}>;
const inputFields = [
  {
    id: "observedTransplantedPlantCounts",
    label: "Observed transplanted plant counts",
    kind: "numberList",
  },
  {
    id: "observedWorkerCounts",
    label: "Observed worker counts",
    kind: "numberList",
  },
  {
    id: "observedSessionHours",
    label: "Observed session hours",
    kind: "numberList",
  },
  {
    id: "callerRemainingPlantCount",
    label: "Caller remaining plant count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSessionHours.forEach((v) =>
    positive(v, "observedSessionHours"),
  );
  aligned(
    input.observedTransplantedPlantCounts,
    input.observedWorkerCounts,
    "observedTransplantedPlantCounts",
  );
  aligned(
    input.observedTransplantedPlantCounts,
    input.observedSessionHours,
    "observedTransplantedPlantCounts",
  );
  input.observedTransplantedPlantCounts.forEach((v) =>
    bounded(v, "plants", 0, 1000000),
  );
  input.observedWorkerCounts.forEach((v) => bounded(v, "workers", 1, 1000));
  bounded(input.callerRemainingPlantCount, "remaining", 0, 1000000);
  const hours = sum(
      input.observedWorkerCounts.map(
        (v, i) => v * input.observedSessionHours[i],
      ),
    ),
    plants = sum(input.observedTransplantedPlantCounts);
  positive(plants, "observedPlants");
  const rate = plants / hours;
  return {
    pooledPlantsPerWorkerHour: rate,
    estimatedRemainingWorkerHours: input.callerRemainingPlantCount / rate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTransplantedPlantCounts: [100, 300],
  observedWorkerCounts: [2, 3],
  observedSessionHours: [1, 2],
  callerRemainingPlantCount: 400,
} satisfies Input;
export const exampleOutput = {
  pooledPlantsPerWorkerHour: 50,
  estimatedRemainingWorkerHours: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/transplant-line-workers-hour",
  title: "Transplant Line Workers Hour Calculator",
  description:
    "Calibrate actual transplant worker-hour exposure across heterogeneous crew sessions, then estimate remaining labor; not pots/hour, assumed staffing or guaranteed work/fatigue completion.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledPlantsPerWorkerHour",
      label: "Pooled plants per worker hour",
      kind: "number",
    },
    {
      id: "estimatedRemainingWorkerHours",
      label: "Estimated remaining worker hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTransplantedPlantCounts:
        value.observedTransplantedPlantCounts as readonly number[],
      observedWorkerCounts: value.observedWorkerCounts as readonly number[],
      observedSessionHours: value.observedSessionHours as readonly number[],
      callerRemainingPlantCount: value.callerRemainingPlantCount as number,
    }),
});
export const run = tool.execute;
export default tool;
