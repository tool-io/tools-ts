import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly myelinVolumeFraction: number;
  readonly axonVolumeFraction: number;
}>;
export type Output = Readonly<{
  readonly fiberVolumeFraction: number;
  readonly aggregateGRatio: number;
}>;
const inputFields = [
  {
    id: "myelinVolumeFraction",
    label: "Myelin volume fraction",
    kind: "number",
  },
  { id: "axonVolumeFraction", label: "Axon volume fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.myelinVolumeFraction, "myelinVolumeFraction");
  fraction(input.axonVolumeFraction, "axonVolumeFraction");
  const fiberVolumeFraction = positive(
    input.myelinVolumeFraction + input.axonVolumeFraction,
    "axonVolumeFraction",
  );
  if (fiberVolumeFraction > 1)
    simpleError(
      "axonVolumeFraction",
      "Disjoint myelin and axon volume fractions cannot sum above one.",
    );
  return {
    fiberVolumeFraction,
    aggregateGRatio: Math.sqrt(input.axonVolumeFraction / fiberVolumeFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  myelinVolumeFraction: 0.2,
  axonVolumeFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  fiberVolumeFraction: 0.8,
  aggregateGRatio: 0.8660254037844386,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/aggregate-imaging-g-ratio",
  title: "G-Ratio",
  description:
    "Compute the aggregate g-ratio sqrt(AVF/(AVF+MVF)) from calibrated volume fractions; not an arithmetic average of individual axon diameter ratios.",
  inputs: inputFields,
  outputs: [
    {
      id: "fiberVolumeFraction",
      label: "Fiber volume fraction",
      kind: "number",
    },
    { id: "aggregateGRatio", label: "Aggregate g ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      myelinVolumeFraction: value.myelinVolumeFraction as number,
      axonVolumeFraction: value.axonVolumeFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
