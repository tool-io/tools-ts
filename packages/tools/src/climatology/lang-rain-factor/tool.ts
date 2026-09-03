import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly annualPrecipitationMm: number;
  readonly annualMeanTemperatureC: number;
}>;
export type Output = Readonly<{ readonly langAnnualRainFactor: number }>;
const inputFields = [
  {
    id: "annualPrecipitationMm",
    label: "Annual precipitation mm",
    kind: "number",
  },
  {
    id: "annualMeanTemperatureC",
    label: "Annual mean temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.annualMeanTemperatureC, "annualMeanTemperatureC");
  nonnegative(input.annualPrecipitationMm, "annualPrecipitationMm");
  return {
    langAnnualRainFactor:
      input.annualPrecipitationMm / input.annualMeanTemperatureC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  annualPrecipitationMm: 1000,
  annualMeanTemperatureC: 20,
} satisfies Input;
export const exampleOutput = { langAnnualRainFactor: 50 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/lang-rain-factor",
  title: "Lang Rain Factor Calculator",
  description:
    "Lang annual P/T rain factor with strictly positive annual mean temperature in Celsius. Distinct from De Martonne P/(T+10) and P/PET. Caller verifies normal coverage and applicability; not a drought category or crop suitability assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "langAnnualRainFactor",
      label: "Lang annual rain factor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      annualPrecipitationMm: value.annualPrecipitationMm as number,
      annualMeanTemperatureC: value.annualMeanTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
