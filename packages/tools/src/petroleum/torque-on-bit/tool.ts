import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedSurfaceDriveTorquesNm: readonly number[];
  readonly observedMatchedOffBottomTorquesNm: readonly number[];
  readonly callerIndependentlyMeasuredTransmissionFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedTransmissionCorrectedBitTorquesNm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSurfaceDriveTorquesNm",
    label: "Observed surface drive torques nm",
    kind: "numberList",
  },
  {
    id: "observedMatchedOffBottomTorquesNm",
    label: "Observed matched off bottom torques nm",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyMeasuredTransmissionFractions",
    label: "Caller independently measured transmission fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSurfaceDriveTorquesNm.forEach((v) =>
    nonnegative(v, "observedSurfaceDriveTorquesNm"),
  );
  input.observedMatchedOffBottomTorquesNm.forEach((v) =>
    nonnegative(v, "observedMatchedOffBottomTorquesNm"),
  );
  input.callerIndependentlyMeasuredTransmissionFractions.forEach((v) =>
    fraction(v, "callerIndependentlyMeasuredTransmissionFractions"),
  );
  aligned(
    input.observedSurfaceDriveTorquesNm,
    input.observedMatchedOffBottomTorquesNm,
    "observedSurfaceDriveTorquesNm",
  );
  aligned(
    input.observedSurfaceDriveTorquesNm,
    input.callerIndependentlyMeasuredTransmissionFractions,
    "observedSurfaceDriveTorquesNm",
  );
  return {
    observedTransmissionCorrectedBitTorquesNm:
      input.observedSurfaceDriveTorquesNm.map(
        (v, i) =>
          (v - input.observedMatchedOffBottomTorquesNm[i]) *
          input.callerIndependentlyMeasuredTransmissionFractions[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSurfaceDriveTorquesNm: [100, 200],
  observedMatchedOffBottomTorquesNm: [20, 50],
  callerIndependentlyMeasuredTransmissionFractions: [0.8, 0.9],
} satisfies Input;
export const exampleOutput = {
  observedTransmissionCorrectedBitTorquesNm: [64, 135],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/torque-on-bit",
  title: "Petroleum Torque On Bit Calculator",
  description:
    "Reconcile actual on/off-bottom surface torque and independently measured transmission factors into signed apparent bit torque, not drive commands or string mechanical safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedTransmissionCorrectedBitTorquesNm",
      label: "Observed transmission corrected bit torques nm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSurfaceDriveTorquesNm:
        value.observedSurfaceDriveTorquesNm as readonly number[],
      observedMatchedOffBottomTorquesNm:
        value.observedMatchedOffBottomTorquesNm as readonly number[],
      callerIndependentlyMeasuredTransmissionFractions:
        value.callerIndependentlyMeasuredTransmissionFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
