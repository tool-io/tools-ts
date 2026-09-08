import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedUnshieldedTransitDose: number;
  readonly callerPermittedModelDose: number;
  readonly callerValidatedAttenuationPerMillimeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedUnshieldedTransitDose",
    label: "Caller calibrated unshielded transit dose",
    kind: "number",
  },
  {
    id: "callerPermittedModelDose",
    label: "Caller permitted model dose",
    kind: "number",
  },
  {
    id: "callerValidatedAttenuationPerMillimeter",
    label: "Caller validated attenuation per millimeter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerCalibratedUnshieldedTransitDose, "dose");
  positive(input.callerPermittedModelDose, "target");
  positive(input.callerValidatedAttenuationPerMillimeter, "attenuation");
  return {
    conditionalExponentialShieldThicknessMm:
      Math.max(
        0,
        Math.log(
          input.callerCalibratedUnshieldedTransitDose /
            input.callerPermittedModelDose,
        ),
      ) / input.callerValidatedAttenuationPerMillimeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedUnshieldedTransitDose: 100,
    callerPermittedModelDose: 10,
    callerValidatedAttenuationPerMillimeter: 1,
  },
  output: {
    result: { conditionalExponentialShieldThicknessMm: 2.302585092994046 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/meteorite-transit-shielding-mm-estimator",
  title: "Meteorite Transit Survival Shielding Thickness mm Estimator",
  description:
    "Conditional one-component exponential shielding inverse with independently calibrated matched dose/attenuation. No secondaries, damage accumulation, mixed radiation or actual organism survival guarantee.",
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
