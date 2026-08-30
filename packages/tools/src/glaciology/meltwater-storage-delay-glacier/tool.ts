import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly intervalDurationsDays: readonly number[];
  readonly inflowVolumesM3PerDay: readonly number[];
  readonly initialStorageM3: number;
  readonly reservoirResidenceDays: number;
}>;
export type Output = Readonly<{
  readonly endStoragesM3: readonly number[];
  readonly releasedVolumesM3: readonly number[];
}>;
const inputFields = [
  {
    id: "intervalDurationsDays",
    label: "Interval durations days",
    kind: "numberList",
  },
  {
    id: "inflowVolumesM3PerDay",
    label: "Inflow volumes m3 per day",
    kind: "numberList",
  },
  { id: "initialStorageM3", label: "Initial storage m3", kind: "number" },
  {
    id: "reservoirResidenceDays",
    label: "Reservoir residence days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.intervalDurationsDays.forEach((v) =>
    positive(v, "intervalDurationsDays"),
  );
  positive(input.reservoirResidenceDays, "reservoirResidenceDays");
  input.inflowVolumesM3PerDay.forEach((v) =>
    nonnegative(v, "inflowVolumesM3PerDay"),
  );
  nonnegative(input.initialStorageM3, "initialStorageM3");
  aligned(
    input.intervalDurationsDays,
    input.inflowVolumesM3PerDay,
    "intervalDurationsDays",
  );
  let storage = input.initialStorageM3;
  const releasedVolumesM3: number[] = [],
    endStoragesM3 = input.intervalDurationsDays.map((dt, i) => {
      const x = dt / input.reservoirResidenceDays,
        a = Math.exp(-x),
        lostFraction = -Math.expm1(-x),
        releaseTime =
          x < 1e-4
            ? dt * (x / 2 - (x * x) / 6 + x ** 3 / 24 - x ** 4 / 120)
            : dt - input.reservoirResidenceDays * lostFraction,
        next =
          storage * a +
          input.inflowVolumesM3PerDay[i] *
            input.reservoirResidenceDays *
            lostFraction;
      releasedVolumesM3.push(
        storage * lostFraction + input.inflowVolumesM3PerDay[i] * releaseTime,
      );
      storage = next;
      return next;
    });
  return { endStoragesM3, releasedVolumesM3 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  intervalDurationsDays: [1, 1],
  inflowVolumesM3PerDay: [10, 0],
  initialStorageM3: 0,
  reservoirResidenceDays: 1,
} satisfies Input;
export const exampleOutput = {
  endStoragesM3: [6.321205588285577, 2.3254415793482965],
  releasedVolumesM3: [3.6787944117144233, 3.9957640089372806],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/meltwater-storage-delay-glacier",
  title: "Meltwater Storage Delay Glacier",
  description:
    "Route piecewise-constant meltwater inflow through an exact linear storage reservoir and close interval volumes; no peak-lag inference or distributed drainage network.",
  inputs: inputFields,
  outputs: [
    { id: "endStoragesM3", label: "End storages m3", kind: "numberList" },
    {
      id: "releasedVolumesM3",
      label: "Released volumes m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      intervalDurationsDays: value.intervalDurationsDays as readonly number[],
      inflowVolumesM3PerDay: value.inflowVolumesM3PerDay as readonly number[],
      initialStorageM3: value.initialStorageM3 as number,
      reservoirResidenceDays: value.reservoirResidenceDays as number,
    }),
});
export const run = tool.execute;
export default tool;
