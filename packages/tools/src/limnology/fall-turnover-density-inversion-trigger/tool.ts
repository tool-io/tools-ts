import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly densitiesKgPerM3: readonly number[];
  readonly inversionToleranceKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly densityDifferencesDownwardKgPerM3: readonly number[];
  readonly unstableIntervalFlags: readonly number[];
  readonly hasResolvedDensityInversion: boolean;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  { id: "densitiesKgPerM3", label: "Densities kg per m3", kind: "numberList" },
  {
    id: "inversionToleranceKgPerM3",
    label: "Inversion tolerance kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.densitiesKgPerM3.forEach((v) => positive(v, "densitiesKgPerM3"));
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  nonnegative(input.inversionToleranceKgPerM3, "inversionToleranceKgPerM3");
  aligned(input.depthsM, input.densitiesKgPerM3, "depthsM");
  ordered(input.depthsM, "depthsM");
  const densityDifferencesDownwardKgPerM3 = input.densitiesKgPerM3
      .slice(1)
      .map((v, i) => v - input.densitiesKgPerM3[i]),
    unstableIntervalFlags = densityDifferencesDownwardKgPerM3.map((v) =>
      v < -input.inversionToleranceKgPerM3 ? 1 : 0,
    );
  return {
    densityDifferencesDownwardKgPerM3,
    unstableIntervalFlags,
    hasResolvedDensityInversion: unstableIntervalFlags.some((v) => v === 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 1, 2],
  densitiesKgPerM3: [1002, 1000, 1001],
  inversionToleranceKgPerM3: 0.1,
} satisfies Input;
export const exampleOutput = {
  densityDifferencesDownwardKgPerM3: [-2, 1],
  unstableIntervalFlags: [1, 0],
  hasResolvedDensityInversion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/fall-turnover-density-inversion-trigger",
  title: "Fall Turnover Density Inversion Trigger",
  description:
    "Screen resolved down-column density inversions against caller measurement tolerance; inversion is a mixing trigger screen, not proof of complete fall turnover.",
  inputs: inputFields,
  outputs: [
    {
      id: "densityDifferencesDownwardKgPerM3",
      label: "Density differences downward kg per m3",
      kind: "numberList",
    },
    {
      id: "unstableIntervalFlags",
      label: "Unstable interval flags",
      kind: "numberList",
    },
    {
      id: "hasResolvedDensityInversion",
      label: "Has resolved density inversion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      densitiesKgPerM3: value.densitiesKgPerM3 as readonly number[],
      inversionToleranceKgPerM3: value.inversionToleranceKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
