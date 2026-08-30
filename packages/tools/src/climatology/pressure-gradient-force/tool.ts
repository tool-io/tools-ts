import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, norm } from "../shared.js";

export type Input = Readonly<{
  readonly pressureGradientPaPerM: readonly number[];
  readonly airDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly pressureGradientAccelerationMPerSecond2: readonly number[];
  readonly pressureGradientAccelerationMagnitudeMPerSecond2: number;
}>;
const inputFields = [
  {
    id: "pressureGradientPaPerM",
    label: "Pressure gradient pa per m",
    kind: "numberList",
  },
  { id: "airDensityKgPerM3", label: "Air density kg per m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.airDensityKgPerM3, "airDensityKgPerM3");
  if (input.pressureGradientPaPerM.length !== 3)
    simpleError(
      "gradient",
      "Three Cartesian pressure-gradient components required.",
    );
  const pressureGradientAccelerationMPerSecond2 =
    input.pressureGradientPaPerM.map((v) => -v / input.airDensityKgPerM3);
  return {
    pressureGradientAccelerationMPerSecond2,
    pressureGradientAccelerationMagnitudeMPerSecond2: norm(
      pressureGradientAccelerationMPerSecond2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pressureGradientPaPerM: [0.001, -0.002, 0.003],
  airDensityKgPerM3: 1,
} satisfies Input;
export const exampleOutput = {
  pressureGradientAccelerationMPerSecond2: [-0.001, 0.002, -0.003],
  pressureGradientAccelerationMagnitudeMPerSecond2: 0.0037416573867739412,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/pressure-gradient-force",
  title: "Pressure Gradient Force per Mass",
  description:
    "Convert measured three-dimensional Cartesian pressure gradient to signed per-mass acceleration; no Coriolis balance, coordinates or hydrostatic-gravity cancellation inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "pressureGradientAccelerationMPerSecond2",
      label: "Pressure gradient acceleration m per second2",
      kind: "numberList",
    },
    {
      id: "pressureGradientAccelerationMagnitudeMPerSecond2",
      label: "Pressure gradient acceleration magnitude m per second2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pressureGradientPaPerM: value.pressureGradientPaPerM as readonly number[],
      airDensityKgPerM3: value.airDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
