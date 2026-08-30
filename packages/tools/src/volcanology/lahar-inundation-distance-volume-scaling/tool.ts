import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly laharVolumeM3: number;
  readonly planformAreaCoefficientBounds: readonly number[];
  readonly areaVolumeExponent: number;
  readonly assumedMeanInundationWidthM: number;
}>;
export type Output = Readonly<{
  readonly planformAreaScenarioBoundsM2: readonly number[];
  readonly rectangularLengthScenarioBoundsM: readonly number[];
}>;
const inputFields = [
  { id: "laharVolumeM3", label: "Lahar volume m3", kind: "number" },
  {
    id: "planformAreaCoefficientBounds",
    label: "Planform area coefficient bounds",
    kind: "numberList",
  },
  { id: "areaVolumeExponent", label: "Area volume exponent", kind: "number" },
  {
    id: "assumedMeanInundationWidthM",
    label: "Assumed mean inundation width m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.planformAreaCoefficientBounds.forEach((v) =>
    positive(v, "planformAreaCoefficientBounds"),
  );
  positive(input.areaVolumeExponent, "areaVolumeExponent");
  positive(input.assumedMeanInundationWidthM, "assumedMeanInundationWidthM");
  nonnegative(input.laharVolumeM3, "laharVolumeM3");
  if (
    input.planformAreaCoefficientBounds.length !== 2 ||
    input.planformAreaCoefficientBounds[0] >
      input.planformAreaCoefficientBounds[1]
  )
    simpleError(
      "planformAreaCoefficientBounds",
      "Two ordered unit-specific positive scaling coefficients required.",
    );
  const planformAreaScenarioBoundsM2 = input.planformAreaCoefficientBounds.map(
    (c) => c * input.laharVolumeM3 ** input.areaVolumeExponent,
  );
  return {
    planformAreaScenarioBoundsM2,
    rectangularLengthScenarioBoundsM: planformAreaScenarioBoundsM2.map(
      (a) => a / input.assumedMeanInundationWidthM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  laharVolumeM3: 1000,
  planformAreaCoefficientBounds: [1, 2],
  areaVolumeExponent: 0.6666666666666666,
  assumedMeanInundationWidthM: 10,
} satisfies Input;
export const exampleOutput = {
  planformAreaScenarioBoundsM2: [100, 200],
  rectangularLengthScenarioBoundsM: [10, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/lahar-inundation-distance-volume-scaling",
  title: "Lahar Inundation Distance Volume Scaling",
  description:
    "Evaluate caller empirical lahar area-volume bounds and a rectangular mean-width length proxy; no terrain routing, geodesy, inundation map or validated warning distance.",
  inputs: inputFields,
  outputs: [
    {
      id: "planformAreaScenarioBoundsM2",
      label: "Planform area scenario bounds m2",
      kind: "numberList",
    },
    {
      id: "rectangularLengthScenarioBoundsM",
      label: "Rectangular length scenario bounds m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      laharVolumeM3: value.laharVolumeM3 as number,
      planformAreaCoefficientBounds:
        value.planformAreaCoefficientBounds as readonly number[],
      areaVolumeExponent: value.areaVolumeExponent as number,
      assumedMeanInundationWidthM: value.assumedMeanInundationWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
