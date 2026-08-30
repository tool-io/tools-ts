import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, norm } from "../shared.js";

export type Input = Readonly<{
  readonly observedWindComponentsMPerSecond: readonly number[];
  readonly suppliedGeostrophicWindComponentsMPerSecond: readonly number[];
}>;
export type Output = Readonly<{
  readonly ageostrophicWindComponentsMPerSecond: readonly number[];
  readonly ageostrophicWindMagnitudeMPerSecond: number;
}>;
const inputFields = [
  {
    id: "observedWindComponentsMPerSecond",
    label: "Observed wind components m per second",
    kind: "numberList",
  },
  {
    id: "suppliedGeostrophicWindComponentsMPerSecond",
    label: "Supplied geostrophic wind components m per second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedWindComponentsMPerSecond.length !== 2 ||
    input.suppliedGeostrophicWindComponentsMPerSecond.length !== 2
  )
    simpleError(
      "winds",
      "Two observed/geostrophic east,north components required.",
    );
  const ageostrophicWindComponentsMPerSecond =
    input.observedWindComponentsMPerSecond.map(
      (v, i) => v - input.suppliedGeostrophicWindComponentsMPerSecond[i],
    );
  return {
    ageostrophicWindComponentsMPerSecond,
    ageostrophicWindMagnitudeMPerSecond: norm(
      ageostrophicWindComponentsMPerSecond,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWindComponentsMPerSecond: [10, 10],
  suppliedGeostrophicWindComponentsMPerSecond: [5, 15],
} satisfies Input;
export const exampleOutput = {
  ageostrophicWindComponentsMPerSecond: [5, -5],
  ageostrophicWindMagnitudeMPerSecond: 7.0710678118654755,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/ageostrophic-component-magnitude",
  title: "Ageostrophic Component Magnitude",
  description:
    "Difference measured and independently supplied geostrophic wind vectors, not scalar speed subtraction or computed pressure-gradient wind.",
  inputs: inputFields,
  outputs: [
    {
      id: "ageostrophicWindComponentsMPerSecond",
      label: "Ageostrophic wind components m per second",
      kind: "numberList",
    },
    {
      id: "ageostrophicWindMagnitudeMPerSecond",
      label: "Ageostrophic wind magnitude m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWindComponentsMPerSecond:
        value.observedWindComponentsMPerSecond as readonly number[],
      suppliedGeostrophicWindComponentsMPerSecond:
        value.suppliedGeostrophicWindComponentsMPerSecond as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
