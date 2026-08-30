import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly leftCoiledCounts: number;
  readonly rightCoiledCounts: number;
  readonly ambiguousCoilingCounts: number;
}>;
export type Output = Readonly<{
  readonly leftPercentOfClassified: number;
  readonly rightPercentOfClassified: number;
  readonly ambiguousPercentOfAll: number;
}>;
const inputFields = [
  { id: "leftCoiledCounts", label: "Left coiled counts", kind: "integer" },
  { id: "rightCoiledCounts", label: "Right coiled counts", kind: "integer" },
  {
    id: "ambiguousCoilingCounts",
    label: "Ambiguous coiling counts",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.leftCoiledCounts, "leftCoiledCounts");
  count(input.rightCoiledCounts, "rightCoiledCounts");
  count(input.ambiguousCoilingCounts, "ambiguousCoilingCounts");
  const n = positive(
    input.leftCoiledCounts + input.rightCoiledCounts,
    "classifiedCoils",
  );
  return {
    leftPercentOfClassified: (100 * input.leftCoiledCounts) / n,
    rightPercentOfClassified: (100 * input.rightCoiledCounts) / n,
    ambiguousPercentOfAll:
      (100 * input.ambiguousCoilingCounts) / (n + input.ambiguousCoilingCounts),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftCoiledCounts: 10,
  rightCoiledCounts: 30,
  ambiguousCoilingCounts: 10,
} satisfies Input;
export const exampleOutput = {
  leftPercentOfClassified: 25,
  rightPercentOfClassified: 75,
  ambiguousPercentOfAll: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/coiling-ratio-percent",
  title: "Foraminifera Test Coiling Ratio Percent",
  description:
    "Report observed foraminiferal coiling proportions with ambiguous tests retained on the full denominator; chirality alone does not infer temperature or a species identity.",
  inputs: inputFields,
  outputs: [
    {
      id: "leftPercentOfClassified",
      label: "Left percent of classified",
      kind: "number",
    },
    {
      id: "rightPercentOfClassified",
      label: "Right percent of classified",
      kind: "number",
    },
    {
      id: "ambiguousPercentOfAll",
      label: "Ambiguous percent of all",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leftCoiledCounts: value.leftCoiledCounts as number,
      rightCoiledCounts: value.rightCoiledCounts as number,
      ambiguousCoilingCounts: value.ambiguousCoilingCounts as number,
    }),
});
export const run = tool.execute;
export default tool;
