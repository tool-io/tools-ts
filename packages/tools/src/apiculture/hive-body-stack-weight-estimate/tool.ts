import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly componentMassesKg: readonly number[];
  readonly componentCounts: readonly number[];
  readonly componentCenterHeightsM: readonly number[];
  readonly standMassKg: number;
  readonly standCenterHeightM: number;
}>;
export type Output = Readonly<{
  readonly totalStackMassKg: number;
  readonly verticalCenterOfMassM: number;
}>;
const inputFields = [
  { id: "componentMassesKg", label: "Component masses kg", kind: "numberList" },
  { id: "componentCounts", label: "Component counts", kind: "numberList" },
  {
    id: "componentCenterHeightsM",
    label: "Component center heights m",
    kind: "numberList",
  },
  { id: "standMassKg", label: "Stand mass kg", kind: "number" },
  { id: "standCenterHeightM", label: "Stand center height m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.componentMassesKg.forEach((v) => nonnegative(v, "componentMassesKg"));
  input.componentCenterHeightsM.forEach((v) =>
    nonnegative(v, "componentCenterHeightsM"),
  );
  nonnegative(input.standMassKg, "standMassKg");
  nonnegative(input.standCenterHeightM, "standCenterHeightM");
  input.componentCounts.forEach((v) => count(v, "componentCounts"));
  aligned(input.componentMassesKg, input.componentCounts, "componentMassesKg");
  aligned(
    input.componentMassesKg,
    input.componentCenterHeightsM,
    "componentMassesKg",
  );
  const totalStackMassKg = positive(
    input.componentMassesKg.reduce(
      (s, v, i) => s + v * input.componentCounts[i],
      input.standMassKg,
    ),
    "totalMass",
  );
  return {
    totalStackMassKg,
    verticalCenterOfMassM:
      input.componentMassesKg.reduce(
        (s, v, i) =>
          s + v * input.componentCounts[i] * input.componentCenterHeightsM[i],
        input.standMassKg * input.standCenterHeightM,
      ) / totalStackMassKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  componentMassesKg: [2, 3],
  componentCounts: [1, 2],
  componentCenterHeightsM: [0.1, 0.4],
  standMassKg: 1,
  standCenterHeightM: 0.05,
} satisfies Input;
export const exampleOutput = {
  totalStackMassKg: 9,
  verticalCenterOfMassM: 0.29444444444444445,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/hive-body-stack-weight-estimate",
  title: "Hive Body Stack Weight Estimate",
  description:
    "Sum disjoint hive/stand component masses and vertical center of mass; component heights are centers, not box dimensions, and tipping/handling safety is not certified.",
  inputs: inputFields,
  outputs: [
    { id: "totalStackMassKg", label: "Total stack mass kg", kind: "number" },
    {
      id: "verticalCenterOfMassM",
      label: "Vertical center of mass m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      componentMassesKg: value.componentMassesKg as readonly number[],
      componentCounts: value.componentCounts as readonly number[],
      componentCenterHeightsM:
        value.componentCenterHeightsM as readonly number[],
      standMassKg: value.standMassKg as number,
      standCenterHeightM: value.standCenterHeightM as number,
    }),
});
export const run = tool.execute;
export default tool;
