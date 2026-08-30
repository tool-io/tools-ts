import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly depthsM: readonly number[];
  readonly eastwardDensityGradientsKgPerM4: readonly number[];
  readonly northwardDensityGradientsKgPerM4: readonly number[];
  readonly referenceDensityKgPerM3: number;
  readonly signedCoriolisPerSecond: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly eastwardTopMinusBottomMPerSecond: number;
  readonly northwardTopMinusBottomMPerSecond: number;
}>;
const inputFields = [
  { id: "depthsM", label: "Depths m", kind: "numberList" },
  {
    id: "eastwardDensityGradientsKgPerM4",
    label: "Eastward density gradients kg per m4",
    kind: "numberList",
  },
  {
    id: "northwardDensityGradientsKgPerM4",
    label: "Northward density gradients kg per m4",
    kind: "numberList",
  },
  {
    id: "referenceDensityKgPerM3",
    label: "Reference density kg per m3",
    kind: "number",
  },
  {
    id: "signedCoriolisPerSecond",
    label: "Signed coriolis per second",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceDensityKgPerM3, "referenceDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  input.depthsM.forEach((v) => nonnegative(v, "depthsM"));
  if (input.signedCoriolisPerSecond === 0)
    simpleError("signedCoriolisPerSecond", "Nonzero supplied f required.");
  const scale =
    input.gravityMPerSecondSquared /
    (input.referenceDensityKgPerM3 * input.signedCoriolisPerSecond);
  return {
    eastwardTopMinusBottomMPerSecond:
      scale * integral(input.depthsM, input.northwardDensityGradientsKgPerM4),
    northwardTopMinusBottomMPerSecond:
      -scale * integral(input.depthsM, input.eastwardDensityGradientsKgPerM4),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  depthsM: [0, 10],
  eastwardDensityGradientsKgPerM4: [0, 1],
  northwardDensityGradientsKgPerM4: [1, 2],
  referenceDensityKgPerM3: 1000,
  signedCoriolisPerSecond: 0.01,
  gravityMPerSecondSquared: 1,
} satisfies Input;
export const exampleOutput = {
  eastwardTopMinusBottomMPerSecond: 1.5,
  northwardTopMinusBottomMPerSecond: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/thermal-wind-vertical-shear",
  title: "Thermal Wind Vertical Shear",
  description:
    "Integrate signed thermal-wind top-minus-bottom shear from measured horizontal density-gradient profiles on positive-down depths; no absolute reference current or mapped coordinate gradients are inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "eastwardTopMinusBottomMPerSecond",
      label: "Eastward top minus bottom m per second",
      kind: "number",
    },
    {
      id: "northwardTopMinusBottomMPerSecond",
      label: "Northward top minus bottom m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      depthsM: value.depthsM as readonly number[],
      eastwardDensityGradientsKgPerM4:
        value.eastwardDensityGradientsKgPerM4 as readonly number[],
      northwardDensityGradientsKgPerM4:
        value.northwardDensityGradientsKgPerM4 as readonly number[],
      referenceDensityKgPerM3: value.referenceDensityKgPerM3 as number,
      signedCoriolisPerSecond: value.signedCoriolisPerSecond as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
