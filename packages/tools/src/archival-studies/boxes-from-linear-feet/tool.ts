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
  count,
  totalCount,
  ledger,
} from "../shared.js";
export type Input = Readonly<{
  readonly usableShelfLengthsFeet: readonly number[];
  readonly boxWidthInches: number;
  readonly interBoxGapInches: number;
}>;
export type Output = Readonly<{
  readonly maximumWholeBoxesByShelf: readonly number[];
  readonly totalWholeBoxes: number;
  readonly unusedShelfInchesByShelf: readonly number[];
}>;
const inputFields = [
  {
    id: "usableShelfLengthsFeet",
    label: "Usable shelf lengths feet",
    kind: "numberList",
  },
  { id: "boxWidthInches", label: "Box width inches", kind: "number" },
  { id: "interBoxGapInches", label: "Inter box gap inches", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.boxWidthInches, "boxWidthInches");
  input.usableShelfLengthsFeet.forEach((v) =>
    nonnegative(v, "usableShelfLengthsFeet"),
  );
  nonnegative(input.interBoxGapInches, "interBoxGapInches");
  if (!input.usableShelfLengthsFeet.length)
    simpleError("shelves", "Actual shelf ledger required.");
  const pitch = positive(
      input.boxWidthInches + input.interBoxGapInches,
      "pitch",
    ),
    n = input.usableShelfLengthsFeet.map((v) =>
      count(Math.floor((v * 12 + input.interBoxGapInches) / pitch), "boxes"),
    );
  return {
    maximumWholeBoxesByShelf: n,
    totalWholeBoxes: totalCount(n, "boxes"),
    unusedShelfInchesByShelf: n.map(
      (v, i) =>
        input.usableShelfLengthsFeet[i] * 12 -
        v * input.boxWidthInches -
        Math.max(0, v - 1) * input.interBoxGapInches,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableShelfLengthsFeet: [2, 3],
  boxWidthInches: 10,
  interBoxGapInches: 2,
} satisfies Input;
export const exampleOutput = {
  maximumWholeBoxesByShelf: [2, 3],
  totalWholeBoxes: 5,
  unusedShelfInchesByShelf: [2, 2],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/boxes-from-linear-feet",
  title: "Box Count from Linear Feet Calculator",
  description:
    "Pack whole same-width boxes independently on actual shelf lengths with N−1 gaps, preserving unusable remainders across shelves rather than pooling fractional boxes.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumWholeBoxesByShelf",
      label: "Maximum whole boxes by shelf",
      kind: "numberList",
    },
    { id: "totalWholeBoxes", label: "Total whole boxes", kind: "number" },
    {
      id: "unusedShelfInchesByShelf",
      label: "Unused shelf inches by shelf",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      usableShelfLengthsFeet: value.usableShelfLengthsFeet as readonly number[],
      boxWidthInches: value.boxWidthInches as number,
      interBoxGapInches: value.interBoxGapInches as number,
    }),
});
export const run = tool.execute;
export default tool;
