import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualCalibratedFanOnlyRmsAcousticPressurePa: number;
  readonly callerIndependentReferencePressurePa: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCalibratedFanOnlyRmsAcousticPressurePa",
    label: "Actual calibrated fan only rms acoustic pressure pa",
    kind: "number",
  },
  {
    id: "callerIndependentReferencePressurePa",
    label: "Caller independent reference pressure pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualCalibratedFanOnlyRmsAcousticPressurePa,
    "actualCalibratedFanOnlyRmsAcousticPressurePa",
  );
  positive(
    input.callerIndependentReferencePressurePa,
    "callerIndependentReferencePressurePa",
  );
  return {
    value:
      20 *
      Math.log10(
        input.actualCalibratedFanOnlyRmsAcousticPressurePa /
          input.callerIndependentReferencePressurePa,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCalibratedFanOnlyRmsAcousticPressurePa: 10,
    callerIndependentReferencePressurePa: 1,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/fan-noise-db",
  title: "Fan Noise dB Calculator",
  description:
    "Actual positive RMS fan-only sound pressure level20log10(p/pref), weighting/measurement/distance externally established; not power sum background noise or safe hearing limit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
