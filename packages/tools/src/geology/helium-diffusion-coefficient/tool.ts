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
  readonly callerMineralCalibratedDiffusionPrefactorSquareMetersPerSecond: number;
  readonly callerMineralCalibratedActivationJoulesPerMole: number;
  readonly temperatureKelvin: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMineralCalibratedDiffusionPrefactorSquareMetersPerSecond",
    label:
      "Caller mineral calibrated diffusion prefactor square meters per second",
    kind: "number",
  },
  {
    id: "callerMineralCalibratedActivationJoulesPerMole",
    label: "Caller mineral calibrated activation joules per mole",
    kind: "number",
  },
  { id: "temperatureKelvin", label: "Temperature kelvin", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerMineralCalibratedDiffusionPrefactorSquareMetersPerSecond,
    "D0",
  );
  nonnegative(input.callerMineralCalibratedActivationJoulesPerMole, "Ea");
  positive(input.temperatureKelvin, "kelvin");
  return {
    conditionalHeliumDiffusionSquareMetersPerSecond:
      input.callerMineralCalibratedDiffusionPrefactorSquareMetersPerSecond *
      expFinite(
        -input.callerMineralCalibratedActivationJoulesPerMole /
          (8.31446261815324 * input.temperatureKelvin),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMineralCalibratedDiffusionPrefactorSquareMetersPerSecond: 1,
    callerMineralCalibratedActivationJoulesPerMole: 2494.338785445972,
    temperatureKelvin: 300,
  },
  output: {
    result: {
      conditionalHeliumDiffusionSquareMetersPerSecond: 0.36787944117144233,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/helium-diffusion-coefficient",
  title: "Geology Helium Diffusion Coefficient Calculator",
  description:
    "Mineral-specific independently fitted helium Arrheniusdiffusion D0exp(\u2212Ea/RT), J/molactivation, SIprefactor. Not semiconductor dopant diffusion, closure temperature or helium retention model; grain orientation/defects independently verified.",
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
