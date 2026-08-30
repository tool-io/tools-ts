import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly rangeStartTimesMyr: readonly number[];
  readonly rangeEndTimesMyr: readonly number[];
  readonly binBoundariesMyr: readonly number[];
}>;
export type Output = Readonly<{
  readonly rangeThroughDiversityByBin: readonly number[];
}>;
const inputFields = [
  {
    id: "rangeStartTimesMyr",
    label: "Range start times myr",
    kind: "numberList",
  },
  { id: "rangeEndTimesMyr", label: "Range end times myr", kind: "numberList" },
  { id: "binBoundariesMyr", label: "Bin boundaries myr", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.rangeStartTimesMyr,
    input.rangeEndTimesMyr,
    "rangeStartTimesMyr",
  );
  ordered(input.binBoundariesMyr, "binBoundariesMyr");
  if (
    input.rangeStartTimesMyr.some((v, i) => v >= input.rangeEndTimesMyr[i]) ||
    input.rangeStartTimesMyr.length * (input.binBoundariesMyr.length - 1) >
      1000000
  )
    simpleError(
      "ranges",
      "Positive-length forward-time ranges and at most one million overlaps required.",
    );
  return {
    rangeThroughDiversityByBin: input.binBoundariesMyr
      .slice(1)
      .map(
        (b, j) =>
          input.rangeStartTimesMyr.filter(
            (a, i) =>
              a < b && input.rangeEndTimesMyr[i] > input.binBoundariesMyr[j],
          ).length,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rangeStartTimesMyr: [0, 1, 3],
  rangeEndTimesMyr: [2, 3, 4],
  binBoundariesMyr: [0, 1, 2, 3, 4],
} satisfies Input;
export const exampleOutput = {
  rangeThroughDiversityByBin: [1, 2, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/standing-diversity-binner",
  title: "Standing Diversity Through Time Binner",
  description:
    "Bin range-through standing diversity using positive-duration half-open ranges on a supplied increasing forward-time axis, excluding endpoint-only touches; ranges do not prove continuous actual occupancy.",
  inputs: inputFields,
  outputs: [
    {
      id: "rangeThroughDiversityByBin",
      label: "Range through diversity by bin",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      rangeStartTimesMyr: value.rangeStartTimesMyr as readonly number[],
      rangeEndTimesMyr: value.rangeEndTimesMyr as readonly number[],
      binBoundariesMyr: value.binBoundariesMyr as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
