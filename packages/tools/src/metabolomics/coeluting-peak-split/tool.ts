import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coelutedTotalArea: number;
  readonly referenceComponentA: number;
  readonly referenceComponentB: number;
}>;
export type Output = Readonly<{
  readonly componentAArea: number;
  readonly componentBArea: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.coelutedTotalArea < 0 ||
    input.referenceComponentA < 0 ||
    input.referenceComponentB < 0 ||
    input.referenceComponentA + input.referenceComponentB <= 0
  )
    simpleError(
      "referenceComponentA",
      "Nonnegative peak and positive component reference total required.",
    );
  const componentAArea =
    (input.coelutedTotalArea * input.referenceComponentA) /
    (input.referenceComponentA + input.referenceComponentB);
  return {
    componentAArea,
    componentBArea: input.coelutedTotalArea - componentAArea,
  };
};
export const exampleInput = {
  coelutedTotalArea: 100,
  referenceComponentA: 3,
  referenceComponentB: 2,
} satisfies Input;
export const exampleOutput = {
  componentAArea: 60,
  componentBArea: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/coeluting-peak-split",
  title: "Coeluting Peak Split",
  description:
    "Allocate a co-eluting peak area using caller-provided component reference intensities.",
  inputs: [
    { id: "coelutedTotalArea", kind: "number", label: "Coeluted total area" },
    {
      id: "referenceComponentA",
      kind: "number",
      label: "Reference component a",
    },
    {
      id: "referenceComponentB",
      kind: "number",
      label: "Reference component b",
    },
  ],
  outputs: [
    { id: "componentAArea", kind: "number", label: "Component a area" },
    { id: "componentBArea", kind: "number", label: "Component b area" },
  ],
  calculate: (value) =>
    calculate({
      coelutedTotalArea: value.coelutedTotalArea as number,
      referenceComponentA: value.referenceComponentA as number,
      referenceComponentB: value.referenceComponentB as number,
    }),
});
export const run = tool.execute;
export default tool;
