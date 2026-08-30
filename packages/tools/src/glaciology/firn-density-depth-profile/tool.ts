import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly surfaceDensityKgPerM3: number;
  readonly iceDensityKgPerM3: number;
  readonly densificationLengthM: number;
}>;
export type Output = Readonly<{ readonly densitiesKgPerM3: readonly number[] }>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  {
    id: "surfaceDensityKgPerM3",
    label: "Surface density kg per m3",
    kind: "number",
  },
  { id: "iceDensityKgPerM3", label: "Ice density kg per m3", kind: "number" },
  {
    id: "densificationLengthM",
    label: "Densification length m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.surfaceDensityKgPerM3, "surfaceDensityKgPerM3");
  positive(input.iceDensityKgPerM3, "iceDensityKgPerM3");
  positive(input.densificationLengthM, "densificationLengthM");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  if (
    !input.depthsM.length ||
    input.surfaceDensityKgPerM3 > input.iceDensityKgPerM3
  )
    simpleError(
      "surfaceDensityKgPerM3",
      "Nonempty depths and surface density no greater than ice required.",
    );
  return {
    densitiesKgPerM3: input.depthsM.map(
      (z) =>
        input.iceDensityKgPerM3 -
        (input.iceDensityKgPerM3 - input.surfaceDensityKgPerM3) *
          Math.exp(-z / input.densificationLengthM),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  surfaceDensityKgPerM3: 300,
  iceDensityKgPerM3: 900,
  densificationLengthM: 10,
} satisfies Input;
export const exampleOutput = {
  densitiesKgPerM3: [300, 679.2723352971345, 818.7988300580324],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/firn-density-depth-profile",
  title: "Firn Density Depth Profile",
  description:
    "Evaluate an explicitly calibrated exponential firn density-depth profile; distinct from stage-specific temperature/accumulation densification kinetics.",
  inputs: inputFields,
  outputs: [
    {
      id: "densitiesKgPerM3",
      label: "Densities kg per m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      surfaceDensityKgPerM3: value.surfaceDensityKgPerM3 as number,
      iceDensityKgPerM3: value.iceDensityKgPerM3 as number,
      densificationLengthM: value.densificationLengthM as number,
    }),
});
export const run = tool.execute;
export default tool;
