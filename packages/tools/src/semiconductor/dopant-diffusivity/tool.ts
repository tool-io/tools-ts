import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  expFinite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedPrefactorSquareMetersPerSecond: number;
  readonly callerCalibratedActivationEnergyEv: number;
  readonly temperatureKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerCalibratedPrefactorSquareMetersPerSecond",
    label: "Caller calibrated prefactor square meters per second",
    kind: "number",
  },
  {
    id: "callerCalibratedActivationEnergyEv",
    label: "Caller calibrated activation energy ev",
    kind: "number",
  },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerCalibratedPrefactorSquareMetersPerSecond, "D0");
  nonnegative(input.callerCalibratedActivationEnergyEv, "Ea");
  positive(input.temperatureKelvin, "kelvin");
  return {
    conditionalDiffusivitySquareMetersPerSecond:
      input.callerCalibratedPrefactorSquareMetersPerSecond *
      expFinite(
        -input.callerCalibratedActivationEnergyEv /
          (8.617333262e-5 * input.temperatureKelvin),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedPrefactorSquareMetersPerSecond: 1,
    callerCalibratedActivationEnergyEv: 0.025851999786,
    temperatureKelvin: 300,
  },
  output: {
    result: {
      conditionalDiffusivitySquareMetersPerSecond: 0.36787944117144233,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/dopant-diffusivity",
  title: "Semiconductor Dopant Diffusivity Calculator",
  description:
    "Generic independently calibrated dopant Arrhenius diffusivity D0exp(\u2212Ea/kBT), SIprefactor, eVactivation and kelvin. Not fixed dilute boron/arsenic/antimony silicon constants, charge-state diffusion or process-specific verified outcome.",
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
