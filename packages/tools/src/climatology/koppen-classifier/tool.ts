import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, classifyKoppen } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly monthlyTemperatureC: readonly number[];
  readonly monthlyPrecipitationMm: readonly number[];
  readonly northernHemisphere: boolean;
}>;
export type Output = Readonly<{
  readonly koppenCode: string;
  readonly annualTemperatureC: number;
  readonly annualPrecipitationMm: number;
  readonly dryClimateThresholdMm: number;
}>;
const inputFields = [
  {
    id: "monthlyTemperatureC",
    label: "Monthly temperature c",
    kind: "numberList",
  },
  {
    id: "monthlyPrecipitationMm",
    label: "Monthly precipitation mm",
    kind: "numberList",
  },
  { id: "northernHemisphere", label: "Northern hemisphere", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return classifyKoppen(
    input.monthlyTemperatureC,
    input.monthlyPrecipitationMm,
    input.northernHemisphere,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  monthlyTemperatureC: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
  monthlyPrecipitationMm: [
    100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  ],
  northernHemisphere: true,
} satisfies Input;
export const exampleOutput = {
  koppenCode: "Af",
  annualTemperatureC: 25,
  annualPrecipitationMm: 1200,
  dryClimateThresholdMm: 640,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/koppen-classifier",
  title: "Koppen Climate Class Classifier",
  description:
    "Köppen–Geiger classification of twelve homogeneous monthly normals with the 0°C temperate/continental boundary and aridity tested first. Northern summer is April–September, reversed in the south. If both dry-season rules apply, s takes priority; tropical dry-season ties use the first driest month. Not a mapped climate identity, crop recommendation or forecast.",
  inputs: inputFields,
  outputs: [
    { id: "koppenCode", label: "Koppen code", kind: "string" },
    { id: "annualTemperatureC", label: "Annual temperature c", kind: "number" },
    {
      id: "annualPrecipitationMm",
      label: "Annual precipitation mm",
      kind: "number",
    },
    {
      id: "dryClimateThresholdMm",
      label: "Dry climate threshold mm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      monthlyTemperatureC: value.monthlyTemperatureC as readonly number[],
      monthlyPrecipitationMm: value.monthlyPrecipitationMm as readonly number[],
      northernHemisphere: value.northernHemisphere as boolean,
    }),
});
export const run = tool.execute;
export default tool;
