import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly fragmentCountsPerRefittedElement: readonly number[];
  readonly unrefittableFragmentCount: number;
}>;
export type Output = Readonly<{
  readonly refittedFragmentationRatio: number;
  readonly fragmentedRefittedElementFraction: number;
  readonly unrefittableFragmentFraction: number;
}>;
const inputFields = [
  {
    id: "fragmentCountsPerRefittedElement",
    label: "Fragment counts per refitted element",
    kind: "numberList",
  },
  {
    id: "unrefittableFragmentCount",
    label: "Unrefittable fragment count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fragmentCountsPerRefittedElement.forEach((v) =>
    positive(v, "fragmentCountsPerRefittedElement"),
  );
  input.fragmentCountsPerRefittedElement.forEach((v) =>
    count(v, "fragmentCountsPerRefittedElement"),
  );
  count(input.unrefittableFragmentCount, "unrefittableFragmentCount");
  const f = input.fragmentCountsPerRefittedElement.reduce((a, b) => a + b, 0);
  positive(f, "fragmentCountsPerRefittedElement");
  return {
    refittedFragmentationRatio:
      f / input.fragmentCountsPerRefittedElement.length,
    fragmentedRefittedElementFraction:
      input.fragmentCountsPerRefittedElement.filter((v) => v > 1).length /
      input.fragmentCountsPerRefittedElement.length,
    unrefittableFragmentFraction:
      input.unrefittableFragmentCount / (f + input.unrefittableFragmentCount),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fragmentCountsPerRefittedElement: [1, 2, 4],
  unrefittableFragmentCount: 3,
} satisfies Input;
export const exampleOutput = {
  refittedFragmentationRatio: 2.3333333333333335,
  fragmentedRefittedElementFraction: 0.6666666666666666,
  unrefittableFragmentFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/fragmentation-index-bone",
  title: "Fragmentation Index Bone Assemblage",
  description:
    "Summarize observed fragment multiplicity on independently refitted elements and retain unrefittable coverage; unidentified pieces do not become inferred elements or breakage histories.",
  inputs: inputFields,
  outputs: [
    {
      id: "refittedFragmentationRatio",
      label: "Refitted fragmentation ratio",
      kind: "number",
    },
    {
      id: "fragmentedRefittedElementFraction",
      label: "Fragmented refitted element fraction",
      kind: "number",
    },
    {
      id: "unrefittableFragmentFraction",
      label: "Unrefittable fragment fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fragmentCountsPerRefittedElement:
        value.fragmentCountsPerRefittedElement as readonly number[],
      unrefittableFragmentCount: value.unrefittableFragmentCount as number,
    }),
});
export const run = tool.execute;
export default tool;
