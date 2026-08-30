import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  count,
  aligned,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly minimumElementNumbers: readonly number[];
  readonly elementCopiesPerSkeleton: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumAnimalUnits: readonly number[];
  readonly maximumNormalizedMauPercentages: readonly number[];
}>;
const inputFields = [
  {
    id: "minimumElementNumbers",
    label: "Minimum element numbers",
    kind: "numberList",
  },
  {
    id: "elementCopiesPerSkeleton",
    label: "Element copies per skeleton",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.elementCopiesPerSkeleton.forEach((v) =>
    positive(v, "elementCopiesPerSkeleton"),
  );
  input.minimumElementNumbers.forEach((v) => count(v, "minimumElementNumbers"));
  input.elementCopiesPerSkeleton.forEach((v) =>
    count(v, "elementCopiesPerSkeleton"),
  );
  aligned(
    input.minimumElementNumbers,
    input.elementCopiesPerSkeleton,
    "minimumElementNumbers",
  );
  const minimumAnimalUnits = input.minimumElementNumbers.map(
      (v, i) => v / input.elementCopiesPerSkeleton[i],
    ),
    max = positive(maximum(minimumAnimalUnits), "minimumElementNumbers");
  return {
    minimumAnimalUnits,
    maximumNormalizedMauPercentages: minimumAnimalUnits.map(
      (v) => (100 * v) / max,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  minimumElementNumbers: [2, 4, 1],
  elementCopiesPerSkeleton: [1, 4, 2],
} satisfies Input;
export const exampleOutput = {
  minimumAnimalUnits: [2, 1, 0.5],
  maximumNormalizedMauPercentages: [100, 50, 25],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/mau-calculator",
  title: "Minimum Animal Units MAU",
  description:
    "Normalize independently established MNE by skeletal element copies and maximum MAU; fractional animal units are representational indexes, unlike ceiling-based MNI individual bounds.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumAnimalUnits",
      label: "Minimum animal units",
      kind: "numberList",
    },
    {
      id: "maximumNormalizedMauPercentages",
      label: "Maximum normalized mau percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      minimumElementNumbers: value.minimumElementNumbers as readonly number[],
      elementCopiesPerSkeleton:
        value.elementCopiesPerSkeleton as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
