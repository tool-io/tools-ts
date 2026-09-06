import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedDissolvedOxygenMolM3: readonly number[];
  readonly callerMatchedSaturationOxygenMolM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedApparentOxygenUtilizationMolM3: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDissolvedOxygenMolM3",
    label: "Observed dissolved oxygen mol m3",
    kind: "numberList",
  },
  {
    id: "callerMatchedSaturationOxygenMolM3",
    label: "Caller matched saturation oxygen mol m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedSaturationOxygenMolM3.forEach((v) =>
    positive(v, "callerMatchedSaturationOxygenMolM3"),
  );
  input.observedDissolvedOxygenMolM3.forEach((v) =>
    nonnegative(v, "observedDissolvedOxygenMolM3"),
  );
  aligned(
    input.observedDissolvedOxygenMolM3,
    input.callerMatchedSaturationOxygenMolM3,
    "observedDissolvedOxygenMolM3",
  );
  return {
    signedApparentOxygenUtilizationMolM3:
      input.observedDissolvedOxygenMolM3.map(
        (v, i) => input.callerMatchedSaturationOxygenMolM3[i] - v,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDissolvedOxygenMolM3: [0.2, 0.3],
  callerMatchedSaturationOxygenMolM3: [0.25, 0.25],
} satisfies Input;
export const exampleOutput = {
  signedApparentOxygenUtilizationMolM3: [0.05, -0.05],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/apparent-oxygen-utilization-aou",
  title: "Apparent Oxygen Utilization AOU Calculator",
  description:
    "Independent matched saturation minus observed oxygen, signed supersaturation retained, no inferred respiration/age or mass/mole conversion. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedApparentOxygenUtilizationMolM3",
      label: "Signed apparent oxygen utilization mol m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDissolvedOxygenMolM3:
        value.observedDissolvedOxygenMolM3 as readonly number[],
      callerMatchedSaturationOxygenMolM3:
        value.callerMatchedSaturationOxygenMolM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
