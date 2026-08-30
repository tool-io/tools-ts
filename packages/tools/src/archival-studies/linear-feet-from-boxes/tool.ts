import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  totalCount,
} from "../shared.js";
export type Input = Readonly<{
  readonly boxCountsByType: readonly number[];
  readonly measuredBoxWidthsInches: readonly number[];
  readonly interBoxSpacingInches: number;
}>;
export type Output = Readonly<{
  readonly totalBoxCount: number;
  readonly occupiedLinearFeet: number;
  readonly boxOnlyLinearFeet: number;
}>;
const inputFields = [
  { id: "boxCountsByType", label: "Box counts by type", kind: "numberList" },
  {
    id: "measuredBoxWidthsInches",
    label: "Measured box widths inches",
    kind: "numberList",
  },
  {
    id: "interBoxSpacingInches",
    label: "Inter box spacing inches",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredBoxWidthsInches.forEach((v) =>
    positive(v, "measuredBoxWidthsInches"),
  );
  nonnegative(input.interBoxSpacingInches, "interBoxSpacingInches");
  input.boxCountsByType.forEach((v) => count(v, "boxCountsByType"));
  aligned(
    input.boxCountsByType,
    input.measuredBoxWidthsInches,
    "boxCountsByType",
  );
  const n = totalCount(input.boxCountsByType, "boxes"),
    width = input.boxCountsByType.reduce(
      (s, v, i) => s + v * input.measuredBoxWidthsInches[i],
      0,
    );
  return {
    totalBoxCount: n,
    occupiedLinearFeet:
      (width + Math.max(0, n - 1) * input.interBoxSpacingInches) / 12,
    boxOnlyLinearFeet: width / 12,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boxCountsByType: [10, 20],
  measuredBoxWidthsInches: [12, 6],
  interBoxSpacingInches: 1,
} satisfies Input;
export const exampleOutput = {
  totalBoxCount: 30,
  occupiedLinearFeet: 22.416666666666668,
  boxOnlyLinearFeet: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/linear-feet-from-boxes",
  title: "Linear Feet from Box Count Calculator",
  description:
    "Expand heterogeneous measured box widths into linear feet with actual inter-box gaps, not cubic-to-linear conversion or universal archival box dimensions.",
  inputs: inputFields,
  outputs: [
    { id: "totalBoxCount", label: "Total box count", kind: "number" },
    { id: "occupiedLinearFeet", label: "Occupied linear feet", kind: "number" },
    { id: "boxOnlyLinearFeet", label: "Box only linear feet", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      boxCountsByType: value.boxCountsByType as readonly number[],
      measuredBoxWidthsInches:
        value.measuredBoxWidthsInches as readonly number[],
      interBoxSpacingInches: value.interBoxSpacingInches as number,
    }),
});
export const run = tool.execute;
export default tool;
