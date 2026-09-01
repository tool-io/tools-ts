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
  nonnegative,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedHarvestedAreasHa: readonly number[];
  readonly observedSessionHours: readonly number[];
  readonly observedNonproductiveHours: readonly number[];
  readonly callerRemainingHarvestAreaHa: number;
}>;
export type Output = Readonly<{
  readonly pooledActiveHarvesterHaHour: number;
  readonly pooledScheduledHarvesterHaHour: number;
  readonly estimatedRemainingScheduledHours: number;
}>;
const inputFields = [
  {
    id: "observedHarvestedAreasHa",
    label: "Observed harvested areas ha",
    kind: "numberList",
  },
  {
    id: "observedSessionHours",
    label: "Observed session hours",
    kind: "numberList",
  },
  {
    id: "observedNonproductiveHours",
    label: "Observed nonproductive hours",
    kind: "numberList",
  },
  {
    id: "callerRemainingHarvestAreaHa",
    label: "Caller remaining harvest area ha",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSessionHours.forEach((v) =>
    positive(v, "observedSessionHours"),
  );
  input.observedHarvestedAreasHa.forEach((v) =>
    nonnegative(v, "observedHarvestedAreasHa"),
  );
  input.observedNonproductiveHours.forEach((v) =>
    nonnegative(v, "observedNonproductiveHours"),
  );
  nonnegative(
    input.callerRemainingHarvestAreaHa,
    "callerRemainingHarvestAreaHa",
  );
  aligned(
    input.observedHarvestedAreasHa,
    input.observedSessionHours,
    "observedHarvestedAreasHa",
  );
  aligned(
    input.observedHarvestedAreasHa,
    input.observedNonproductiveHours,
    "observedHarvestedAreasHa",
  );
  if (
    input.observedNonproductiveHours.some(
      (v, i) => v > input.observedSessionHours[i],
    )
  )
    simpleError("time", "Nonproductive time exceeds measured session.");
  const area = sum(input.observedHarvestedAreasHa),
    scheduled = sum(input.observedSessionHours),
    active = scheduled - sum(input.observedNonproductiveHours);
  positive(area, "observedArea");
  positive(active, "activeHours");
  return {
    pooledActiveHarvesterHaHour: area / active,
    pooledScheduledHarvesterHaHour: area / scheduled,
    estimatedRemainingScheduledHours:
      input.callerRemainingHarvestAreaHa / (area / scheduled),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHarvestedAreasHa: [1, 2],
  observedSessionHours: [2, 3],
  observedNonproductiveHours: [0.5, 1],
  callerRemainingHarvestAreaHa: 4,
} satisfies Input;
export const exampleOutput = {
  pooledActiveHarvesterHaHour: 0.8571428571428571,
  pooledScheduledHarvesterHaHour: 0.6,
  estimatedRemainingScheduledHours: 6.666666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/harvester-throughput-hectares-hour",
  title: "Harvester Throughput Hectares Hour Calculator",
  description:
    "Calibrate actual harvester productive/scheduled area rates and remaining scheduled-time estimate across unequal sessions; no crop mass-rate or generic picker-day budget, no guaranteed machinery performance.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledActiveHarvesterHaHour",
      label: "Pooled active harvester ha hour",
      kind: "number",
    },
    {
      id: "pooledScheduledHarvesterHaHour",
      label: "Pooled scheduled harvester ha hour",
      kind: "number",
    },
    {
      id: "estimatedRemainingScheduledHours",
      label: "Estimated remaining scheduled hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedHarvestedAreasHa:
        value.observedHarvestedAreasHa as readonly number[],
      observedSessionHours: value.observedSessionHours as readonly number[],
      observedNonproductiveHours:
        value.observedNonproductiveHours as readonly number[],
      callerRemainingHarvestAreaHa:
        value.callerRemainingHarvestAreaHa as number,
    }),
});
export const run = tool.execute;
export default tool;
