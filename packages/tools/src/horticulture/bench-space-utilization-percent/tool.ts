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
  readonly benchUsableAreasM2: readonly number[];
  readonly observedOccupiedAreasM2: readonly number[];
  readonly observedBlockedAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly netAvailableBenchAreasM2: readonly number[];
  readonly occupiedShareOfNetBenchArea: number;
  readonly unoccupiedNetBenchAreaM2: number;
}>;
const inputFields = [
  {
    id: "benchUsableAreasM2",
    label: "Bench usable areas m2",
    kind: "numberList",
  },
  {
    id: "observedOccupiedAreasM2",
    label: "Observed occupied areas m2",
    kind: "numberList",
  },
  {
    id: "observedBlockedAreasM2",
    label: "Observed blocked areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.benchUsableAreasM2.forEach((v) => positive(v, "benchUsableAreasM2"));
  input.observedOccupiedAreasM2.forEach((v) =>
    nonnegative(v, "observedOccupiedAreasM2"),
  );
  input.observedBlockedAreasM2.forEach((v) =>
    nonnegative(v, "observedBlockedAreasM2"),
  );
  aligned(
    input.benchUsableAreasM2,
    input.observedOccupiedAreasM2,
    "benchUsableAreasM2",
  );
  aligned(
    input.benchUsableAreasM2,
    input.observedBlockedAreasM2,
    "benchUsableAreasM2",
  );
  const net = input.benchUsableAreasM2.map(
    (v, i) => v - input.observedBlockedAreasM2[i],
  );
  if (net.some((v, i) => v < 0 || input.observedOccupiedAreasM2[i] > v))
    simpleError(
      "bench",
      "Observed nonoverlapping occupation/blockage cannot exceed gross bench area.",
    );
  const area = sum(net),
    occupied = sum(input.observedOccupiedAreasM2);
  positive(area, "netArea");
  return {
    netAvailableBenchAreasM2: net,
    occupiedShareOfNetBenchArea: occupied / area,
    unoccupiedNetBenchAreaM2: area - occupied,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  benchUsableAreasM2: [10, 20],
  observedOccupiedAreasM2: [8, 10],
  observedBlockedAreasM2: [1, 5],
} satisfies Input;
export const exampleOutput = {
  netAvailableBenchAreasM2: [9, 15],
  occupiedShareOfNetBenchArea: 0.75,
  unoccupiedNetBenchAreaM2: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/bench-space-utilization-percent",
  title: "Bench Space Utilization Percent Calculator",
  description:
    "Reconcile actual bench occupation against independent nonoverlapping blocked area with pooled net-area denominator; not occupancy of greenhouse floor, overlapping polygons or universal utilization target.",
  inputs: inputFields,
  outputs: [
    {
      id: "netAvailableBenchAreasM2",
      label: "Net available bench areas m2",
      kind: "numberList",
    },
    {
      id: "occupiedShareOfNetBenchArea",
      label: "Occupied share of net bench area",
      kind: "number",
    },
    {
      id: "unoccupiedNetBenchAreaM2",
      label: "Unoccupied net bench area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      benchUsableAreasM2: value.benchUsableAreasM2 as readonly number[],
      observedOccupiedAreasM2:
        value.observedOccupiedAreasM2 as readonly number[],
      observedBlockedAreasM2: value.observedBlockedAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
