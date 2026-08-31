import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, aligned } from "../batch-shared.js";
export type Input = Readonly<{
  readonly paragraphLineTotals: readonly number[];
  readonly firstFragmentLineCounts: readonly number[];
  readonly callerMinimumFragmentLines: number;
}>;
export type Output = Readonly<{
  readonly orphanFirstFragmentParagraphIndices: readonly number[];
  readonly widowLastFragmentParagraphIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "paragraphLineTotals",
    label: "Paragraph line totals",
    kind: "numberList",
  },
  {
    id: "firstFragmentLineCounts",
    label: "First fragment line counts",
    kind: "numberList",
  },
  {
    id: "callerMinimumFragmentLines",
    label: "Caller minimum fragment lines",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.paragraphLineTotals,
    input.firstFragmentLineCounts,
    "paragraphLineTotals",
  );
  bounded(input.callerMinimumFragmentLines, "minimum", 1, 100);
  input.paragraphLineTotals.forEach((v, i) => {
    bounded(v, "totalLines", 1, 10000);
    bounded(input.firstFragmentLineCounts[i], "firstFragment", 0, v);
  });
  return {
    orphanFirstFragmentParagraphIndices: input.firstFragmentLineCounts.flatMap(
      (v, i) =>
        v > 0 &&
        v < input.paragraphLineTotals[i] &&
        v < input.callerMinimumFragmentLines
          ? [i]
          : [],
    ),
    widowLastFragmentParagraphIndices: input.firstFragmentLineCounts.flatMap(
      (v, i) => {
        const remaining = input.paragraphLineTotals[i] - v;
        return v > 0 &&
          remaining > 0 &&
          remaining < input.callerMinimumFragmentLines
          ? [i]
          : [];
      },
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  paragraphLineTotals: [5, 5],
  firstFragmentLineCounts: [1, 4],
  callerMinimumFragmentLines: 2,
} satisfies Input;
export const exampleOutput = {
  orphanFirstFragmentParagraphIndices: [0],
  widowLastFragmentParagraphIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/widow-orphan-line-flag-checker",
  title: "Widow Orphan Line Flag Checker",
  description:
    "Flag actual paragraph splits from typeset line evidence under caller minimum fragments; explicitly calls short first fragment orphan and short last fragment widow, no inference of rendered line counts from raw text or universal naming convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "orphanFirstFragmentParagraphIndices",
      label: "Orphan first fragment paragraph indices",
      kind: "numberList",
    },
    {
      id: "widowLastFragmentParagraphIndices",
      label: "Widow last fragment paragraph indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      paragraphLineTotals: value.paragraphLineTotals as readonly number[],
      firstFragmentLineCounts:
        value.firstFragmentLineCounts as readonly number[],
      callerMinimumFragmentLines: value.callerMinimumFragmentLines as number,
    }),
});
export const run = tool.execute;
export default tool;
