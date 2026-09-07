import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerAlganSpontaneousPolarizationCM2: number;
  readonly callerAlganPiezoPolarizationCM2: number;
  readonly callerGanTotalPolarizationCM2: number;
  readonly callerNormalAlganToGan: boolean;
}>;
export type Output = Readonly<{
  readonly signedInterfaceBoundPolarizationChargeCM2: number;
}>;
const inputFields = [
  {
    id: "callerAlganSpontaneousPolarizationCM2",
    label: "Caller algan spontaneous polarization c m2",
    kind: "number",
  },
  {
    id: "callerAlganPiezoPolarizationCM2",
    label: "Caller algan piezo polarization c m2",
    kind: "number",
  },
  {
    id: "callerGanTotalPolarizationCM2",
    label: "Caller gan total polarization c m2",
    kind: "number",
  },
  {
    id: "callerNormalAlganToGan",
    label: "Caller normal algan to gan",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const delta =
    input.callerGanTotalPolarizationCM2 -
    input.callerAlganSpontaneousPolarizationCM2 -
    input.callerAlganPiezoPolarizationCM2;
  return {
    signedInterfaceBoundPolarizationChargeCM2: input.callerNormalAlganToGan
      ? delta
      : -delta,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlganSpontaneousPolarizationCM2: -0.03,
  callerAlganPiezoPolarizationCM2: -0.01,
  callerGanTotalPolarizationCM2: -0.02,
  callerNormalAlganToGan: true,
} satisfies Input;
export const exampleOutput = {
  signedInterfaceBoundPolarizationChargeCM2: 0.02,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/algan-polarization-charge",
  title: "Semiconductor AlGaN Polarization Charge Calculator",
  description:
    "Reconcile caller independently established AlGaN spontaneous/piezo and GaN polarization with explicit interface normal; not charge magnitude from measured 2DEG or assumed strain/composition model.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedInterfaceBoundPolarizationChargeCM2",
      label: "Signed interface bound polarization charge c m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAlganSpontaneousPolarizationCM2:
        value.callerAlganSpontaneousPolarizationCM2 as number,
      callerAlganPiezoPolarizationCM2:
        value.callerAlganPiezoPolarizationCM2 as number,
      callerGanTotalPolarizationCM2:
        value.callerGanTotalPolarizationCM2 as number,
      callerNormalAlganToGan: value.callerNormalAlganToGan as boolean,
    }),
});
export const run = tool.execute;
export default tool;
