import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentVoltageLengthProductVoltMeters: number;
  readonly actualInteractionLengthMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentVoltageLengthProductVoltMeters",
    label: "Caller independent voltage length product volt meters",
    kind: "number",
  },
  {
    id: "actualInteractionLengthMeters",
    label: "Actual interaction length meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerIndependentVoltageLengthProductVoltMeters,
    "calibration",
  );
  positive(input.actualInteractionLengthMeters, "length");
  return {
    conditionalHalfWaveVoltageVolts:
      input.callerIndependentVoltageLengthProductVoltMeters /
      input.actualInteractionLengthMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentVoltageLengthProductVoltMeters: 2,
    actualInteractionLengthMeters: 4,
  },
  output: { result: { conditionalHalfWaveVoltageVolts: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/mach-zehnder-half-wave-voltage",
  title: "Semiconductor Mach Zehnder Half Wave Voltage Calculator",
  description:
    "Independently applicable Mach\u2013Zehnder voltage-length calibration divided by actual interaction length to infer V\u03c0under that convention. Distinct from existing forward V\u03c0Lproduct; single-arm/push-pull, electrode/material and wavelength definitions caller verified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
