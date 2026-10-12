import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualLatitudeDegrees: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLatitudeDegrees",
    label: "Actual latitude degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (
    input.actualLatitudeDegrees === 0 ||
    Math.abs(input.actualLatitudeDegrees) >= 90
  )
    simpleError("latitude", "Nonzero nonpolar actuallatitude.");
  return {
    minimumCircumpolarAbsoluteDeclinationDegrees:
      90 - Math.abs(input.actualLatitudeDegrees),
    circumpolarHemisphere: input.actualLatitudeDegrees > 0 ? "north" : "south",
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualLatitudeDegrees: 30 },
  output: {
    result: {
      minimumCircumpolarAbsoluteDeclinationDegrees: 60,
      circumpolarHemisphere: "north",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/circumpolar-declination-threshold-latitude",
  title: "Circumpolar Declination Threshold By Latitude",
  description:
    "Geometriccircumpolarthresholdsamehemispheredec|\u03b4|\u226590\u2212|\u03c6|,boundaryhorizontangent,refractionexcluded. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimumCircumpolarAbsoluteDeclinationDegrees: { type: "number" },
          circumpolarHemisphere: { type: "string" },
        },
        required: [
          "minimumCircumpolarAbsoluteDeclinationDegrees",
          "circumpolarHemisphere",
        ],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
