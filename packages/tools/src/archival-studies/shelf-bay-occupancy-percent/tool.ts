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
} from "../shared.js";
export type Input = Readonly<{
  readonly occupiedShelfLengthsM: readonly number[];
  readonly usableShelfLengthsM: readonly number[];
  readonly reservedGrowthLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly currentBayLinearOccupancyPercent: number;
  readonly committedBayLinearOccupancyPercent: number;
  readonly localSignedShelfMarginsM: readonly number[];
}>;
const inputFields = [
  {
    id: "occupiedShelfLengthsM",
    label: "Occupied shelf lengths m",
    kind: "numberList",
  },
  {
    id: "usableShelfLengthsM",
    label: "Usable shelf lengths m",
    kind: "numberList",
  },
  {
    id: "reservedGrowthLengthsM",
    label: "Reserved growth lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.usableShelfLengthsM.forEach((v) => positive(v, "usableShelfLengthsM"));
  input.occupiedShelfLengthsM.forEach((v) =>
    nonnegative(v, "occupiedShelfLengthsM"),
  );
  input.reservedGrowthLengthsM.forEach((v) =>
    nonnegative(v, "reservedGrowthLengthsM"),
  );
  aligned(
    input.occupiedShelfLengthsM,
    input.usableShelfLengthsM,
    "occupiedShelfLengthsM",
  );
  aligned(
    input.occupiedShelfLengthsM,
    input.reservedGrowthLengthsM,
    "occupiedShelfLengthsM",
  );
  if (
    input.occupiedShelfLengthsM.some((v, i) => v > input.usableShelfLengthsM[i])
  )
    simpleError("occupied", "Current shelf extent must fit usable length.");
  const n = sum(input.usableShelfLengthsM),
    occ = sum(input.occupiedShelfLengthsM);
  return {
    currentBayLinearOccupancyPercent: (100 * occ) / n,
    committedBayLinearOccupancyPercent:
      (100 * (occ + sum(input.reservedGrowthLengthsM))) / n,
    localSignedShelfMarginsM: input.usableShelfLengthsM.map(
      (v, i) =>
        v - input.occupiedShelfLengthsM[i] - input.reservedGrowthLengthsM[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  occupiedShelfLengthsM: [1, 2],
  usableShelfLengthsM: [2, 3],
  reservedGrowthLengthsM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  currentBayLinearOccupancyPercent: 60,
  committedBayLinearOccupancyPercent: 90,
  localSignedShelfMarginsM: [0.5, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/shelf-bay-occupancy-percent",
  title: "Shelf Bay Occupancy Percent Calculator",
  description:
    "Audit shelf linear extent with separately committed growth reservations and local margins, not object slot/zone volume occupancy; committed overflow may exceed 100%.",
  inputs: inputFields,
  outputs: [
    {
      id: "currentBayLinearOccupancyPercent",
      label: "Current bay linear occupancy percent",
      kind: "number",
    },
    {
      id: "committedBayLinearOccupancyPercent",
      label: "Committed bay linear occupancy percent",
      kind: "number",
    },
    {
      id: "localSignedShelfMarginsM",
      label: "Local signed shelf margins m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      occupiedShelfLengthsM: value.occupiedShelfLengthsM as readonly number[],
      usableShelfLengthsM: value.usableShelfLengthsM as readonly number[],
      reservedGrowthLengthsM: value.reservedGrowthLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
