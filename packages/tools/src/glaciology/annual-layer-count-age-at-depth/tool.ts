import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly boundaryDepthsM: readonly number[];
  readonly annualLayersPerInterval: readonly number[];
  readonly hiatusYearsPerInterval: readonly number[];
  readonly surfaceAgeYears: number;
}>;
export type Output = Readonly<{
  readonly agesAtBoundariesYears: readonly number[];
}>;
const inputFields = [
  { id: "boundaryDepthsM", label: "Boundary depths m", kind: "numberList" },
  {
    id: "annualLayersPerInterval",
    label: "Annual layers per interval",
    kind: "numberList",
  },
  {
    id: "hiatusYearsPerInterval",
    label: "Hiatus years per interval",
    kind: "numberList",
  },
  { id: "surfaceAgeYears", label: "Surface age years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.boundaryDepthsM.forEach((v) => nonnegative(v, "boundaryDepthsM"));
  input.hiatusYearsPerInterval.forEach((v) =>
    nonnegative(v, "hiatusYearsPerInterval"),
  );
  nonnegative(input.surfaceAgeYears, "surfaceAgeYears");
  input.annualLayersPerInterval.forEach((v) =>
    count(v, "annualLayersPerInterval"),
  );
  ordered(input.boundaryDepthsM, "boundaryDepthsM");
  aligned(
    input.boundaryDepthsM.slice(1),
    input.annualLayersPerInterval,
    "annualLayersPerInterval",
  );
  aligned(
    input.annualLayersPerInterval,
    input.hiatusYearsPerInterval,
    "annualLayersPerInterval",
  );
  let age = input.surfaceAgeYears;
  const agesAtBoundariesYears = [age];
  input.annualLayersPerInterval.forEach((v, i) => {
    age += v + input.hiatusYearsPerInterval[i];
    agesAtBoundariesYears.push(age);
  });
  return { agesAtBoundariesYears };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  boundaryDepthsM: [0, 1, 2],
  annualLayersPerInterval: [10, 20],
  hiatusYearsPerInterval: [0, 5],
  surfaceAgeYears: 0,
} satisfies Input;
export const exampleOutput = {
  agesAtBoundariesYears: [0, 10, 35],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/annual-layer-count-age-at-depth",
  title: "Annual Layer Count Age At Depth",
  description:
    "Accumulate interpreted annual-layer counts and separately supplied hiatus years at depth boundaries; ambiguous/missing annuality must be resolved externally.",
  inputs: inputFields,
  outputs: [
    {
      id: "agesAtBoundariesYears",
      label: "Ages at boundaries years",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      boundaryDepthsM: value.boundaryDepthsM as readonly number[],
      annualLayersPerInterval:
        value.annualLayersPerInterval as readonly number[],
      hiatusYearsPerInterval: value.hiatusYearsPerInterval as readonly number[],
      surfaceAgeYears: value.surfaceAgeYears as number,
    }),
});
export const run = tool.execute;
export default tool;
