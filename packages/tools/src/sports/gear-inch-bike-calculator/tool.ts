import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  bounded,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly measuredLoadedWheelDiametersInches: readonly number[];
  readonly frontTeeth: readonly number[];
  readonly rearTeeth: readonly number[];
}>;
export type Output = Readonly<{
  readonly gearInchesByCombination: readonly number[];
}>;
const inputFields = [
  {
    id: "measuredLoadedWheelDiametersInches",
    label: "Measured loaded wheel diameters inches",
    kind: "numberList",
  },
  { id: "frontTeeth", label: "Front teeth", kind: "numberList" },
  { id: "rearTeeth", label: "Rear teeth", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredLoadedWheelDiametersInches.forEach((v) =>
    positive(v, "measuredLoadedWheelDiametersInches"),
  );
  aligned(
    input.measuredLoadedWheelDiametersInches,
    input.frontTeeth,
    "measuredLoadedWheelDiametersInches",
  );
  aligned(input.frontTeeth, input.rearTeeth, "frontTeeth");
  [...input.frontTeeth, ...input.rearTeeth].forEach((v) =>
    bounded(v, "teeth", 1, 200),
  );
  return {
    gearInchesByCombination: input.measuredLoadedWheelDiametersInches.map(
      (v, i) => (v * input.frontTeeth[i]) / input.rearTeeth[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredLoadedWheelDiametersInches: [26, 28],
  frontTeeth: [50, 48],
  rearTeeth: [25, 16],
} satisfies Input;
export const exampleOutput = {
  gearInchesByCombination: [52, 84],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/gear-inch-bike-calculator",
  title: "Gear Inch Bike Calculator",
  description:
    "Calculate actual wheel/gearing combination mechanical gear-inch inventory, distinct from cadence→ground speed and not a fit recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "gearInchesByCombination",
      label: "Gear inches by combination",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredLoadedWheelDiametersInches:
        value.measuredLoadedWheelDiametersInches as readonly number[],
      frontTeeth: value.frontTeeth as readonly number[],
      rearTeeth: value.rearTeeth as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
