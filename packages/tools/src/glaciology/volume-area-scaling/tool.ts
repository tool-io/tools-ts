import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly areasKm2: readonly number[];
  readonly scalingCoefficientKm3: number;
  readonly areaExponent: number;
}>;
export type Output = Readonly<{
  readonly predictedVolumesKm3: readonly number[];
  readonly meanThicknessesM: readonly number[];
}>;
const inputFields = [
  { id: "areasKm2", label: "Areas km2", kind: "numberList" },
  {
    id: "scalingCoefficientKm3",
    label: "Scaling coefficient km3",
    kind: "number",
  },
  { id: "areaExponent", label: "Area exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.areasKm2.forEach((v) => positive(v, "areasKm2"));
  positive(input.scalingCoefficientKm3, "scalingCoefficientKm3");
  positive(input.areaExponent, "areaExponent");
  if (!input.areasKm2.length)
    simpleError("areasKm2", "Nonempty glacier areas required.");
  const predictedVolumesKm3 = input.areasKm2.map(
    (v) => input.scalingCoefficientKm3 * v ** input.areaExponent,
  );
  return {
    predictedVolumesKm3,
    meanThicknessesM: predictedVolumesKm3.map(
      (v, i) => (1000 * v) / input.areasKm2[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  areasKm2: [1, 4],
  scalingCoefficientKm3: 0.1,
  areaExponent: 1.5,
} satisfies Input;
export const exampleOutput = {
  predictedVolumesKm3: [0.1, 0.8],
  meanThicknessesM: [100, 200],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/volume-area-scaling",
  title: "Volume Area Scaling",
  description:
    "Evaluate caller-calibrated V=cA^gamma with A in km² and V in km³; coefficient is unit-specific and does not establish measured thickness.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedVolumesKm3",
      label: "Predicted volumes km3",
      kind: "numberList",
    },
    { id: "meanThicknessesM", label: "Mean thicknesses m", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      areasKm2: value.areasKm2 as readonly number[],
      scalingCoefficientKm3: value.scalingCoefficientKm3 as number,
      areaExponent: value.areaExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
