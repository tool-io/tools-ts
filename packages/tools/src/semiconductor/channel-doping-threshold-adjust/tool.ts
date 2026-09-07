import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedChannelAddedSheetChargeCM2: readonly number[];
  readonly callerMatchedGateCapacitanceFM2: readonly number[];
  readonly observedOriginalThresholdV: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedChannelDopingThresholdChangesV: readonly number[];
  readonly modeledAdjustedThresholdV: readonly number[];
}>;
const inputFields = [
  {
    id: "observedChannelAddedSheetChargeCM2",
    label: "Observed channel added sheet charge c m2",
    kind: "numberList",
  },
  {
    id: "callerMatchedGateCapacitanceFM2",
    label: "Caller matched gate capacitance f m2",
    kind: "numberList",
  },
  {
    id: "observedOriginalThresholdV",
    label: "Observed original threshold v",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMatchedGateCapacitanceFM2.forEach((v) =>
    positive(v, "callerMatchedGateCapacitanceFM2"),
  );
  aligned(
    input.observedChannelAddedSheetChargeCM2,
    input.callerMatchedGateCapacitanceFM2,
    "observedChannelAddedSheetChargeCM2",
  );
  aligned(
    input.observedChannelAddedSheetChargeCM2,
    input.observedOriginalThresholdV,
    "observedChannelAddedSheetChargeCM2",
  );
  const shifts = input.observedChannelAddedSheetChargeCM2.map(
    (v, i) => -v / input.callerMatchedGateCapacitanceFM2[i],
  );
  return {
    signedChannelDopingThresholdChangesV: shifts,
    modeledAdjustedThresholdV: shifts.map(
      (v, i) => v + input.observedOriginalThresholdV[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedChannelAddedSheetChargeCM2: [0.01, -0.02],
  callerMatchedGateCapacitanceFM2: [0.1, 0.2],
  observedOriginalThresholdV: [1, 2],
} satisfies Input;
export const exampleOutput = {
  signedChannelDopingThresholdChangesV: [-0.1, 0.1],
  modeledAdjustedThresholdV: [0.9, 2.1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/channel-doping-threshold-adjust",
  title: "Semiconductor Channel Doping Threshold Adjust Calculator",
  description:
    "Apply caller signed added-channel sheet charge to independently measured oxide capacitance and initial threshold, explicit ΔV=−ΔQ/C; not body-effect or original flatband calculation.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedChannelDopingThresholdChangesV",
      label: "Signed channel doping threshold changes v",
      kind: "numberList",
    },
    {
      id: "modeledAdjustedThresholdV",
      label: "Modeled adjusted threshold v",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedChannelAddedSheetChargeCM2:
        value.observedChannelAddedSheetChargeCM2 as readonly number[],
      callerMatchedGateCapacitanceFM2:
        value.callerMatchedGateCapacitanceFM2 as readonly number[],
      observedOriginalThresholdV:
        value.observedOriginalThresholdV as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
