import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualRelativeHumidityFraction: number;
  readonly actualAirTemperatureC: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualRelativeHumidityFraction",
    label: "Actual relative humidity fraction",
    kind: "number",
  },
  {
    id: "actualAirTemperatureC",
    label: "Actual air temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  fraction(
    input.actualRelativeHumidityFraction,
    "actualRelativeHumidityFraction",
  );
  positive(input.actualRelativeHumidityFraction, "RH");
  if (input.actualAirTemperatureC < -40 || input.actualAirTemperatureC > 50)
    simpleError("T", "Declaredbranch.");
  return {
    value:
      (243.04 *
        (Math.log(input.actualRelativeHumidityFraction) +
          (17.625 * input.actualAirTemperatureC) /
            (243.04 + input.actualAirTemperatureC))) /
      (17.625 -
        (Math.log(input.actualRelativeHumidityFraction) +
          (17.625 * input.actualAirTemperatureC) /
            (243.04 + input.actualAirTemperatureC))),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualRelativeHumidityFraction: 1, actualAirTemperatureC: 20 },
  output: { result: { value: 20.000000000000004 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/dewpoint-magnus",
  title: "Dewpoint from RH and T Magnus Calculator",
  description:
    "Magnusliquidwaterdewpoint17.625/243.04,T\u221240\u202650C,0<RH\u22641,no arbitrarydry0log/inferred saturationphase. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
