import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  ordered,
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly ambientDensitiesKgPerM3: readonly number[];
  readonly inflowDensityKgPerM3: number;
}>;
export type Output = Readonly<{ readonly neutralBuoyancyPlungeDepthM: number }>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  {
    id: "ambientDensitiesKgPerM3",
    label: "Ambient densities kg per m3",
    kind: "numberList",
  },
  {
    id: "inflowDensityKgPerM3",
    label: "Inflow density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.ambientDensitiesKgPerM3.forEach((v) =>
    positive(v, "ambientDensitiesKgPerM3"),
  );
  positive(input.inflowDensityKgPerM3, "inflowDensityKgPerM3");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  ordered(input.ambientDensitiesKgPerM3, "ambientDensitiesKgPerM3");
  return {
    neutralBuoyancyPlungeDepthM: crossing(
      input.depthsM,
      input.ambientDensitiesKgPerM3,
      input.inflowDensityKgPerM3,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10, 20],
  ambientDensitiesKgPerM3: [1000, 1001, 1002],
  inflowDensityKgPerM3: 1001.5,
} satisfies Input;
export const exampleOutput = {
  neutralBuoyancyPlungeDepthM: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/density-current-plunge-depth",
  title: "Density Current Plunge Depth",
  description:
    "Interpolate neutral-buoyancy depth for an inflow in a strictly stable measured density profile; unbracketed underflow/overflow remains censored, and entrainment, slope and momentum are not modeled.",
  inputs: inputFields,
  outputs: [
    {
      id: "neutralBuoyancyPlungeDepthM",
      label: "Neutral buoyancy plunge depth m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      ambientDensitiesKgPerM3:
        value.ambientDensitiesKgPerM3 as readonly number[],
      inflowDensityKgPerM3: value.inflowDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
