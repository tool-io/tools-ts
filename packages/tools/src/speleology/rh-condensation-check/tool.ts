import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredSurfaceTemperatureKelvin: number;
  readonly actualIndependentlyMeasuredAirDewPointKelvin: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyMeasuredSurfaceTemperatureKelvin",
    label: "Actual independently measured surface temperature kelvin",
    kind: "number",
  },
  {
    id: "actualIndependentlyMeasuredAirDewPointKelvin",
    label: "Actual independently measured air dew point kelvin",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualIndependentlyMeasuredSurfaceTemperatureKelvin,
    "surfacekelvin",
  );
  positive(
    input.actualIndependentlyMeasuredAirDewPointKelvin,
    "dewpointkelvin",
  );
  return {
    signedSurfaceMinusDewPointKelvin:
      input.actualIndependentlyMeasuredSurfaceTemperatureKelvin -
      input.actualIndependentlyMeasuredAirDewPointKelvin,
    conditionalCondensationThermodynamicIndication:
      input.actualIndependentlyMeasuredSurfaceTemperatureKelvin <=
      input.actualIndependentlyMeasuredAirDewPointKelvin,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredSurfaceTemperatureKelvin: 280,
    actualIndependentlyMeasuredAirDewPointKelvin: 285,
  },
  output: {
    result: {
      signedSurfaceMinusDewPointKelvin: -5,
      conditionalCondensationThermodynamicIndication: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/rh-condensation-check",
  title: "Relative Humidity Condensation Point Check",
  description:
    "Actual surface versus independently measured/calculated matched air dewpoint, not RH alone or guaranteed condensation-rate prediction. Material/air motion/measurement uncertainty external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedSurfaceMinusDewPointKelvin: { type: "number" },
          conditionalCondensationThermodynamicIndication: { type: "boolean" },
        },
        required: [
          "signedSurfaceMinusDewPointKelvin",
          "conditionalCondensationThermodynamicIndication",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
