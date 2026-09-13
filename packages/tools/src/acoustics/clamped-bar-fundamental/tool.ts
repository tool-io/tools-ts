import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualUniformBarLengthMeters: number;
  readonly callerFlexuralRigidity: number;
  readonly actualMassPerUnitLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualUniformBarLengthMeters",
    label: "Actual uniform bar length meters",
    kind: "number",
  },
  {
    id: "callerFlexuralRigidity",
    label: "Caller flexural rigidity",
    kind: "number",
  },
  {
    id: "actualMassPerUnitLength",
    label: "Actual mass per unit length",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualUniformBarLengthMeters, "actualUniformBarLengthMeters");
  positive(input.callerFlexuralRigidity, "callerFlexuralRigidity");
  positive(input.actualMassPerUnitLength, "actualMassPerUnitLength");
  return {
    value:
      (1.875104068711961 ** 2 /
        (2 * Math.PI * input.actualUniformBarLengthMeters ** 2)) *
      Math.sqrt(input.callerFlexuralRigidity / input.actualMassPerUnitLength),
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
  input: {
    actualUniformBarLengthMeters: 1,
    callerFlexuralRigidity: 1,
    actualMassPerUnitLength: 1,
  },
  output: { result: { value: 0.5595912099683765 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/clamped-bar-fundamental",
  title: "Clamped Bar Fundamental Calculator",
  description:
    "RestrictedEuler\u2013BernoulliuniformFIXED-FREEcantileverfundamental,\u03b21\u22481.8751040687,not both-endclamped/torsion/shortthickbar. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
