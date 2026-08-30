import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly newWoodyDebrisPieceCounts: readonly number[];
  readonly surveyedStreamLengthsM: readonly number[];
  readonly elapsedYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPieceRecruitmentPer100MPerYear: readonly number[];
  readonly pooledPieceRecruitmentPer100MYear: number;
}>;
const inputFields = [
  {
    id: "newWoodyDebrisPieceCounts",
    label: "New woody debris piece counts",
    kind: "numberList",
  },
  {
    id: "surveyedStreamLengthsM",
    label: "Surveyed stream lengths m",
    kind: "numberList",
  },
  { id: "elapsedYears", label: "Elapsed years", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.surveyedStreamLengthsM.forEach((v) =>
    positive(v, "surveyedStreamLengthsM"),
  );
  input.elapsedYears.forEach((v) => positive(v, "elapsedYears"));
  input.newWoodyDebrisPieceCounts.forEach((v) =>
    count(v, "newWoodyDebrisPieceCounts"),
  );
  aligned(
    input.newWoodyDebrisPieceCounts,
    input.surveyedStreamLengthsM,
    "newWoodyDebrisPieceCounts",
  );
  aligned(
    input.newWoodyDebrisPieceCounts,
    input.elapsedYears,
    "newWoodyDebrisPieceCounts",
  );
  return {
    observedPieceRecruitmentPer100MPerYear: input.newWoodyDebrisPieceCounts.map(
      (v, i) =>
        (100 * v) / (input.surveyedStreamLengthsM[i] * input.elapsedYears[i]),
    ),
    pooledPieceRecruitmentPer100MYear:
      (100 * input.newWoodyDebrisPieceCounts.reduce((a, b) => a + b, 0)) /
      input.surveyedStreamLengthsM.reduce(
        (s, v, i) => s + v * input.elapsedYears[i],
        0,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  newWoodyDebrisPieceCounts: [2, 4],
  surveyedStreamLengthsM: [100, 200],
  elapsedYears: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedPieceRecruitmentPer100MPerYear: [2, 1],
  pooledPieceRecruitmentPer100MYear: 1.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/large-woody-debris-recruitment-piece-per-100m",
  title: "Large Woody Debris Recruitment Pieces/100m",
  description:
    "Normalize newly observed qualifying woody debris by stream-length×time exposure with a caller consistent piece definition; not standing debris count or geometric volume.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPieceRecruitmentPer100MPerYear",
      label: "Observed piece recruitment per100 m per year",
      kind: "numberList",
    },
    {
      id: "pooledPieceRecruitmentPer100MYear",
      label: "Pooled piece recruitment per100 m year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      newWoodyDebrisPieceCounts:
        value.newWoodyDebrisPieceCounts as readonly number[],
      surveyedStreamLengthsM: value.surveyedStreamLengthsM as readonly number[],
      elapsedYears: value.elapsedYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
