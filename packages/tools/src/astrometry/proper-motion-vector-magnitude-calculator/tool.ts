import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly raStarProperMotionMasPerYear: number;
  readonly decProperMotionMasPerYear: number;
}>;
export type Output = Readonly<{ readonly totalProperMotionMasPerYear: number }>;
const inputFields = [
  {
    id: "raStarProperMotionMasPerYear",
    label: "Ra star proper motion mas per year",
    kind: "number",
  },
  {
    id: "decProperMotionMasPerYear",
    label: "Dec proper motion mas per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    totalProperMotionMasPerYear: Math.hypot(
      input.raStarProperMotionMasPerYear,
      input.decProperMotionMasPerYear,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  raStarProperMotionMasPerYear: 3,
  decProperMotionMasPerYear: 4,
} satisfies Input;
export const exampleOutput = {
  totalProperMotionMasPerYear: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/proper-motion-vector-magnitude-calculator",
  title: "Proper Motion RA Dec Components Total Vector Magnitude Calculator",
  description:
    "Tangent-plane vector magnitude with RA*=RA cos Dec supplied, not raw RA coordinate rate. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalProperMotionMasPerYear",
      label: "Total proper motion mas per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      raStarProperMotionMasPerYear:
        value.raStarProperMotionMasPerYear as number,
      decProperMotionMasPerYear: value.decProperMotionMasPerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
