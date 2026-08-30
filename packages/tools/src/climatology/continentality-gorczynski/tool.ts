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
  maximum,
  minimum,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyMeanTemperaturesC: readonly number[];
  readonly absoluteLatitudeDegrees: number;
}>;
export type Output = Readonly<{
  readonly gorczynskiContinentalityIndex: number;
}>;
const inputFields = [
  {
    id: "monthlyMeanTemperaturesC",
    label: "Monthly mean temperatures c",
    kind: "numberList",
  },
  {
    id: "absoluteLatitudeDegrees",
    label: "Absolute latitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.absoluteLatitudeDegrees, "absoluteLatitudeDegrees");
  months(input.monthlyMeanTemperaturesC, "months");
  if (input.absoluteLatitudeDegrees > 90)
    simpleError("latitude", "Absolute latitude within (0,90] required.");
  return {
    gorczynskiContinentalityIndex:
      (1.7 *
        (maximum(input.monthlyMeanTemperaturesC) -
          minimum(input.monthlyMeanTemperaturesC))) /
        Math.sin((input.absoluteLatitudeDegrees * Math.PI) / 180) -
      20.4,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyMeanTemperaturesC: [0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20],
  absoluteLatitudeDegrees: 30,
} satisfies Input;
export const exampleOutput = {
  gorczynskiContinentalityIndex: 47.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/continentality-gorczynski",
  title: "Continentality Gorczynski Index",
  description:
    "Evaluate named Gorczynski annual thermal-range continentality, retaining signed index and rejecting equatorial singularity; no geography or universal climate category.",
  inputs: inputFields,
  outputs: [
    {
      id: "gorczynskiContinentalityIndex",
      label: "Gorczynski continentality index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyMeanTemperaturesC:
        value.monthlyMeanTemperaturesC as readonly number[],
      absoluteLatitudeDegrees: value.absoluteLatitudeDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
