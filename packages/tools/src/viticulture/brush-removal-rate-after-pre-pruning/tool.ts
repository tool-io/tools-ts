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
  readonly observedCollectedBrushGrossKg: readonly number[];
  readonly measuredCollectionTareKg: readonly number[];
  readonly observedActiveRemovalHours: readonly number[];
  readonly observedRemainingBrushMassKg: number;
}>;
export type Output = Readonly<{
  readonly netCollectedBrushMassKg: readonly number[];
  readonly pooledBrushRemovalKgActiveHour: number;
  readonly estimatedRemainingBrushRemovalHours: number;
}>;
const inputFields = [
  {
    id: "observedCollectedBrushGrossKg",
    label: "Observed collected brush gross kg",
    kind: "numberList",
  },
  {
    id: "measuredCollectionTareKg",
    label: "Measured collection tare kg",
    kind: "numberList",
  },
  {
    id: "observedActiveRemovalHours",
    label: "Observed active removal hours",
    kind: "numberList",
  },
  {
    id: "observedRemainingBrushMassKg",
    label: "Observed remaining brush mass kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedActiveRemovalHours.forEach((v) =>
    positive(v, "observedActiveRemovalHours"),
  );
  input.observedCollectedBrushGrossKg.forEach((v) =>
    nonnegative(v, "observedCollectedBrushGrossKg"),
  );
  input.measuredCollectionTareKg.forEach((v) =>
    nonnegative(v, "measuredCollectionTareKg"),
  );
  nonnegative(
    input.observedRemainingBrushMassKg,
    "observedRemainingBrushMassKg",
  );
  aligned(
    input.observedCollectedBrushGrossKg,
    input.measuredCollectionTareKg,
    "observedCollectedBrushGrossKg",
  );
  aligned(
    input.observedCollectedBrushGrossKg,
    input.observedActiveRemovalHours,
    "observedCollectedBrushGrossKg",
  );
  const net = input.observedCollectedBrushGrossKg.map(
    (v, i) => v - input.measuredCollectionTareKg[i],
  );
  if (net.some((v) => v < 0))
    simpleError("tare", "Collection tare exceeds gross.");
  const mass = sum(net);
  positive(mass, "observedBrush");
  const rate = mass / sum(input.observedActiveRemovalHours);
  return {
    netCollectedBrushMassKg: net,
    pooledBrushRemovalKgActiveHour: rate,
    estimatedRemainingBrushRemovalHours:
      input.observedRemainingBrushMassKg / rate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCollectedBrushGrossKg: [110, 210],
  measuredCollectionTareKg: [10, 10],
  observedActiveRemovalHours: [1, 2],
  observedRemainingBrushMassKg: 150,
} satisfies Input;
export const exampleOutput = {
  netCollectedBrushMassKg: [100, 200],
  pooledBrushRemovalKgActiveHour: 100,
  estimatedRemainingBrushRemovalHours: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/brush-removal-rate-after-pre-pruning",
  title: "Brush Removal Rate After Pre Pruning Calculator",
  description:
    "Calibrate actual tare-corrected brush collection per unequal active-hour exposure and remaining measured brush inventory; not pruning wood per vine or pre-pruner travel, no biomass disposal/worker safety guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "netCollectedBrushMassKg",
      label: "Net collected brush mass kg",
      kind: "numberList",
    },
    {
      id: "pooledBrushRemovalKgActiveHour",
      label: "Pooled brush removal kg active hour",
      kind: "number",
    },
    {
      id: "estimatedRemainingBrushRemovalHours",
      label: "Estimated remaining brush removal hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCollectedBrushGrossKg:
        value.observedCollectedBrushGrossKg as readonly number[],
      measuredCollectionTareKg:
        value.measuredCollectionTareKg as readonly number[],
      observedActiveRemovalHours:
        value.observedActiveRemovalHours as readonly number[],
      observedRemainingBrushMassKg:
        value.observedRemainingBrushMassKg as number,
    }),
});
export const run = tool.execute;
export default tool;
