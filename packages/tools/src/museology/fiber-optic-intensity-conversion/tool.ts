import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSourceLuminousFluxLumens: number;
  readonly callerCalibratedDeliveredFraction: number;
  readonly independentlyMeasuredIlluminatedAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSourceLuminousFluxLumens",
    label: "Independently measured source luminous flux lumens",
    kind: "number",
  },
  {
    id: "callerCalibratedDeliveredFraction",
    label: "Caller calibrated delivered fraction",
    kind: "number",
  },
  {
    id: "independentlyMeasuredIlluminatedAreaSquareMeters",
    label: "Independently measured illuminated area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredSourceLuminousFluxLumens, "flux");
  fraction(input.callerCalibratedDeliveredFraction, "delivery");
  positive(input.independentlyMeasuredIlluminatedAreaSquareMeters, "area");
  return {
    conditionalMeanDeliveredIlluminanceLux:
      (input.independentlyMeasuredSourceLuminousFluxLumens *
        input.callerCalibratedDeliveredFraction) /
      input.independentlyMeasuredIlluminatedAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSourceLuminousFluxLumens: 100,
    callerCalibratedDeliveredFraction: 0.5,
    independentlyMeasuredIlluminatedAreaSquareMeters: 2,
  },
  output: { result: { conditionalMeanDeliveredIlluminanceLux: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/fiber-optic-intensity-conversion",
  title: "Fiber Optic Case Lighting Intensity Conversion Calculator",
  description:
    "Conditional uniform fiber-optic delivered illuminance from matched measured source flux, calibrated delivery and area. Not peak/object lux, optical losses without calibration, thermal exposure or conservation-safe limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
