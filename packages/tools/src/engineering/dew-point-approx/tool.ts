import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualAirTemperatureCelsius: number;
  readonly actualRelativeHumidityFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAirTemperatureCelsius",
    label: "Actual air temperature celsius",
    kind: "number",
  },
  {
    id: "actualRelativeHumidityFraction",
    label: "Actual relative humidity fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.actualAirTemperatureCelsius < -40 ||
    input.actualAirTemperatureCelsius > 60
  )
    simpleError("temperature", "Declared liquid-water Magnusbranch−40…60°C.");
  fraction(input.actualRelativeHumidityFraction, "RH");
  positive(input.actualRelativeHumidityFraction, "RH");
  const g =
    Math.log(input.actualRelativeHumidityFraction) +
    (17.62 * input.actualAirTemperatureCelsius) /
      (243.12 + input.actualAirTemperatureCelsius);
  return { conditionalMagnusDewPointCelsius: (243.12 * g) / (17.62 - g) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualAirTemperatureCelsius: 20,
    actualRelativeHumidityFraction: 0.5,
  },
  output: { result: { conditionalMagnusDewPointCelsius: 9.255174598981256 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/dew-point-approx",
  title: "Dew Point Approx Calculator",
  description:
    "Explicit liquid-water Magnusapproximation17.62/243.12\u00b0Cmatched airtemperature\u221240to60\u00b0C,0<RH\u22641. Not petroleum dewpointpressure, ice-branch dewpoint or exact humidity thermodynamics.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
