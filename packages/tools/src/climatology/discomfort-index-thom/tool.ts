import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualTemperatureC: number;
  readonly actualRelativeHumidityPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualTemperatureC", label: "Actual temperature c", kind: "number" },
  {
    id: "actualRelativeHumidityPercent",
    label: "Actual relative humidity percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (
    input.actualRelativeHumidityPercent < 0 ||
    input.actualRelativeHumidityPercent > 100
  )
    simpleError("RH", "0…100percent.");
  return {
    value:
      input.actualTemperatureC -
      0.55 *
        (1 - input.actualRelativeHumidityPercent / 100) *
        (input.actualTemperatureC - 14.5),
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
  input: { actualTemperatureC: 20, actualRelativeHumidityPercent: 100 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/discomfort-index-thom",
  title: "Relative Strain Discomfort Index Calculator",
  description:
    "DeclaredThomDI=T\u2212.55(1\u2212RH/100)(T\u221214.5),empiricaldescriptor not medicaldiscomfortdiagnosis. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
