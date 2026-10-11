import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualPureWaterTemperatureC: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualPureWaterTemperatureC",
    label: "Actual pure water temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (
    input.actualPureWaterTemperatureC < 0 ||
    input.actualPureWaterTemperatureC > 40
  )
    simpleError("T", "0…40Cbranch.");
  return {
    value:
      1402.388 +
      5.0383 * input.actualPureWaterTemperatureC -
      0.058109 * input.actualPureWaterTemperatureC ** 2 +
      0.00033432 * input.actualPureWaterTemperatureC ** 3 -
      0.00000147797 * input.actualPureWaterTemperatureC ** 4 +
      0.0000000031419 * input.actualPureWaterTemperatureC ** 5,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualPureWaterTemperatureC: 0 },
  output: { result: { value: 1402.388 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/speed-of-sound-in-water",
  title: "Speed of Sound in Water Calculator",
  description:
    "Restricted purewaterMarczaktemperaturepolynomialm/satnearambientpressure,0\u2264T\u226440C,not generalpressure/salinitymodel. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
