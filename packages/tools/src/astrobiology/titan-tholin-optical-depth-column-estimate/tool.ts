import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedColumnMassKgPerSquareMeter: number;
  readonly callerCalibratedMassExtinctionSquareMetersPerKg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedColumnMassKgPerSquareMeter",
    label: "Caller verified column mass kg per square meter",
    kind: "number",
  },
  {
    id: "callerCalibratedMassExtinctionSquareMetersPerKg",
    label: "Caller calibrated mass extinction square meters per kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerVerifiedColumnMassKgPerSquareMeter, "column");
  nonnegative(
    input.callerCalibratedMassExtinctionSquareMetersPerKg,
    "extinction",
  );
  const t =
    input.callerVerifiedColumnMassKgPerSquareMeter *
    input.callerCalibratedMassExtinctionSquareMetersPerKg;
  return {
    conditionalOpticalDepth: t,
    conditionalDirectTransmission: Math.exp(-t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedColumnMassKgPerSquareMeter: 2,
    callerCalibratedMassExtinctionSquareMetersPerKg: 3,
  },
  output: {
    result: {
      conditionalOpticalDepth: 6,
      conditionalDirectTransmission: 0.0024787521766663585,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/titan-tholin-optical-depth-column-estimate",
  title: "Titan Tholin Haze Optical Depth Column Estimate Calculator",
  description:
    "Conditional Titantholin optical depth \u03ba\u00d7column and direct exp(\u2212\u03c4) transmission using wavelength/configuration-matched extinction. Not multiple-scattering radiance, actual chemical identity or biosignature.",
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
