import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLunarRadiusKm: number;
  readonly callerActualPerigeeDistanceKm: number;
  readonly callerActualApogeeDistanceKm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLunarRadiusKm",
    label: "Actual lunar radius km",
    kind: "number",
  },
  {
    id: "callerActualPerigeeDistanceKm",
    label: "Caller actual perigee distance km",
    kind: "number",
  },
  {
    id: "callerActualApogeeDistanceKm",
    label: "Caller actual apogee distance km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualLunarRadiusKm, "R");
  positive(input.callerActualPerigeeDistanceKm, "perigee");
  positive(input.callerActualApogeeDistanceKm, "apogee");
  if (
    input.callerActualPerigeeDistanceKm <= input.actualLunarRadiusKm ||
    input.callerActualApogeeDistanceKm < input.callerActualPerigeeDistanceKm
  )
    simpleError("distance", "R<perigee≤apogeeactualcenterdistances.");
  return {
    perigeeAngularDiameterArcminutes:
      ((2 *
        Math.asin(
          input.actualLunarRadiusKm / input.callerActualPerigeeDistanceKm,
        ) *
        180) /
        Math.PI) *
      60,
    apogeeAngularDiameterArcminutes:
      ((2 *
        Math.asin(
          input.actualLunarRadiusKm / input.callerActualApogeeDistanceKm,
        ) *
        180) /
        Math.PI) *
      60,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLunarRadiusKm: 1,
    callerActualPerigeeDistanceKm: 2,
    callerActualApogeeDistanceKm: 4,
  },
  output: {
    result: {
      perigeeAngularDiameterArcminutes: 3600.0000000000005,
      apogeeAngularDiameterArcminutes: 1737.3014623115907,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/moon-apparent-size-arcminutes-perigee-apogee",
  title: "Moon Apparent Size Perigee/Apogee Arcmin",
  description:
    "ExactSPHERICALlimb2asin(R/d)Moonangularsizeactualperigee/apogeedistances,not disk2atanor observedpercentageincrease. Actual independent model/unit/frame/epoch/calibration and applicable measurement established;not precise ephemeris,forecast,geodesy operation,identity or safety approval.",
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
          perigeeAngularDiameterArcminutes: { type: "number" },
          apogeeAngularDiameterArcminutes: { type: "number" },
        },
        required: [
          "perigeeAngularDiameterArcminutes",
          "apogeeAngularDiameterArcminutes",
        ],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
