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
  fraction,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly crossValleyCoordinatesM: readonly number[];
  readonly iceThicknessesM: readonly number[];
  readonly characteristicThicknessM: number;
}>;
export type Output = Readonly<{
  readonly crossSectionAreaM2: number;
  readonly wettedBedPerimeterM: number;
  readonly geometricShapeFactor: number;
}>;
const inputFields = [
  {
    id: "crossValleyCoordinatesM",
    label: "Cross valley coordinates m",
    kind: "numberList",
  },
  { id: "iceThicknessesM", label: "Ice thicknesses m", kind: "numberList" },
  {
    id: "characteristicThicknessM",
    label: "Characteristic thickness m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.characteristicThicknessM, "characteristicThicknessM");
  input.iceThicknessesM.forEach((v) => nonnegative(v, "iceThicknessesM"));
  const crossSectionAreaM2 = positive(
    integral(input.crossValleyCoordinatesM, input.iceThicknessesM),
    "iceThicknessesM",
  );
  if (input.iceThicknessesM[0] !== 0 || input.iceThicknessesM.at(-1) !== 0)
    simpleError(
      "iceThicknessesM",
      "Valley section must meet zero ice thickness at both edges.",
    );
  const wettedBedPerimeterM = input.crossValleyCoordinatesM
    .slice(1)
    .reduce(
      (s, v, i) =>
        s +
        Math.hypot(
          v - input.crossValleyCoordinatesM[i],
          input.iceThicknessesM[i + 1] - input.iceThicknessesM[i],
        ),
      0,
    );
  return {
    crossSectionAreaM2,
    wettedBedPerimeterM,
    geometricShapeFactor: fraction(
      crossSectionAreaM2 /
        (wettedBedPerimeterM * input.characteristicThicknessM),
      "characteristicThicknessM",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crossValleyCoordinatesM: [-10, 0, 10],
  iceThicknessesM: [0, 10, 0],
  characteristicThicknessM: 10,
} satisfies Input;
export const exampleOutput = {
  crossSectionAreaM2: 100,
  wettedBedPerimeterM: 28.284271247461902,
  geometricShapeFactor: 0.35355339059327373,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/shape-factor-valley-correction",
  title: "Shape Factor Valley Correction",
  description:
    "Estimate valley shape factor A/(P·H) from a flat-surface piecewise-linear bed section; not inversion from basal stress or a universal valley correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "crossSectionAreaM2",
      label: "Cross section area m2",
      kind: "number",
    },
    {
      id: "wettedBedPerimeterM",
      label: "Wetted bed perimeter m",
      kind: "number",
    },
    {
      id: "geometricShapeFactor",
      label: "Geometric shape factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crossValleyCoordinatesM:
        value.crossValleyCoordinatesM as readonly number[],
      iceThicknessesM: value.iceThicknessesM as readonly number[],
      characteristicThicknessM: value.characteristicThicknessM as number,
    }),
});
export const run = tool.execute;
export default tool;
