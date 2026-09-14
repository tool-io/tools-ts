import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualInitialCenterOfMassHeight: number;
  readonly callerIndependentEnergyConversionFraction: number;
  readonly actualApproachSpeed: number;
  readonly callerGravity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualInitialCenterOfMassHeight",
    label: "Actual initial center of mass height",
    kind: "number",
  },
  {
    id: "callerIndependentEnergyConversionFraction",
    label: "Caller independent energy conversion fraction",
    kind: "number",
  },
  { id: "actualApproachSpeed", label: "Actual approach speed", kind: "number" },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualInitialCenterOfMassHeight,
    "actualInitialCenterOfMassHeight",
  );
  fraction(
    input.callerIndependentEnergyConversionFraction,
    "callerIndependentEnergyConversionFraction",
  );
  nonnegative(input.actualApproachSpeed, "actualApproachSpeed");
  positive(input.callerGravity, "callerGravity");
  return {
    value:
      input.actualInitialCenterOfMassHeight +
      (input.callerIndependentEnergyConversionFraction *
        input.actualApproachSpeed ** 2) /
        (2 * input.callerGravity),
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
    actualInitialCenterOfMassHeight: 1,
    callerIndependentEnergyConversionFraction: 1,
    actualApproachSpeed: 2,
    callerGravity: 1,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/pole-vault-energy-approx-height",
  title: "Pole Vault Energy Approximate Height",
  description:
    "IdealpolevaultCOMenergyheight h0+\u03b7v\u00b2/(2g),efficiencyindependent,no clearancebodyshape/polelosses/safevaultingload. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
