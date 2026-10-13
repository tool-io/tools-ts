import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualEqualObservationTemperaturesC: readonly number[];
  readonly actualObservationHoursEach: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualEqualObservationTemperaturesC",
    label: "Actual equal observation temperatures c",
    kind: "numberList",
  },
  {
    id: "actualObservationHoursEach",
    label: "Actual observation hours each",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualEqualObservationTemperaturesC.length)
    simpleError(
      "actualEqualObservationTemperaturesC",
      "Actualnonemptyobservations.",
    );
  positive(input.actualObservationHoursEach, "actualObservationHoursEach");
  return {
    value: sum(
      input.actualEqualObservationTemperaturesC.map((v) =>
        v >= 0 && v <= 7.2 ? input.actualObservationHoursEach : 0,
      ),
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualEqualObservationTemperaturesC: [-1, 0, 7.2, 8],
    actualObservationHoursEach: 2,
  },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/chill-hours-accumulator",
  title: "Chill Hours Accumulator 0-7.2C",
  description:
    "Declaredinclusive0\u20267.2Cchill-hourbinaccumulationactualuniformtimeobservations,not DynamicModelchillportionsor dormancyforecast. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
