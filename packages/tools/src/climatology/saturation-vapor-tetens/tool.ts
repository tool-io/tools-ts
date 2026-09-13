import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  expFinite,
} from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualAirTemperatureC: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAirTemperatureC",
    label: "Actual air temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (input.actualAirTemperatureC < -40 || input.actualAirTemperatureC > 50)
    simpleError("T", "Declared−40…50C branch.");
  return {
    value:
      0.6108 *
      expFinite(
        (17.27 * input.actualAirTemperatureC) /
          (input.actualAirTemperatureC + 237.3),
      ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualAirTemperatureC: 0 },
  output: { result: { value: 0.6108 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/saturation-vapor-tetens",
  title: "Saturation Vapor Pressure Tetens Calculator",
  description:
    "RestrictedliquidwaterTetenssaturationvaporpressurekPa,T\u221240\u202650C,no ice branchorfractionRHparameter. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
