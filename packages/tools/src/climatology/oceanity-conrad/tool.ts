import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  maximum,
  minimum,
  months,
} from "../shared.js";

export type Input = Readonly<{
  readonly monthlyMeanTemperaturesC: readonly number[];
  readonly absoluteLatitudeDegrees: number;
}>;
export type Output = Readonly<{
  readonly conradContinentalityIndex: number;
  readonly complementaryOceanityIndex: number;
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
  nonnegative(input.absoluteLatitudeDegrees, "absoluteLatitudeDegrees");
  months(input.monthlyMeanTemperaturesC, "months");
  if (input.absoluteLatitudeDegrees > 90)
    simpleError("latitude", "Absolute latitude within [0,90] required.");
  const conradContinentalityIndex =
    (1.7 *
      (maximum(input.monthlyMeanTemperaturesC) -
        minimum(input.monthlyMeanTemperaturesC))) /
      Math.sin(((input.absoluteLatitudeDegrees + 10) * Math.PI) / 180) -
    14;
  return {
    conradContinentalityIndex,
    complementaryOceanityIndex: 100 - conradContinentalityIndex,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyMeanTemperaturesC: [0, 0, 0, 0, 0, 0, 20, 20, 20, 20, 20, 20],
  absoluteLatitudeDegrees: 20,
} satisfies Input;
export const exampleOutput = {
  conradContinentalityIndex: 54,
  complementaryOceanityIndex: 46,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/oceanity-conrad",
  title: "Oceanity Conrad Index",
  description:
    "Report named Conrad range/latitude-offset continentality and explicit 100-minus complementary oceanity convention; not clamped percentages or an independently validated maritime-climate probability.",
  inputs: inputFields,
  outputs: [
    {
      id: "conradContinentalityIndex",
      label: "Conrad continentality index",
      kind: "number",
    },
    {
      id: "complementaryOceanityIndex",
      label: "Complementary oceanity index",
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
