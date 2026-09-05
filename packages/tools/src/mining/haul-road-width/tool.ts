import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRoadUsableWidthsM: readonly number[];
  readonly observedVehicleEnvelopeWidthsM: readonly number[];
  readonly callerIndependentSideClearanceM: readonly number[];
  readonly callerRequiredConcurrentVehicleCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedWidthVehicleSlotCounts: readonly number[];
  readonly signedConcurrentSlotMargins: readonly number[];
}>;
const inputFields = [
  {
    id: "observedRoadUsableWidthsM",
    label: "Observed road usable widths m",
    kind: "numberList",
  },
  {
    id: "observedVehicleEnvelopeWidthsM",
    label: "Observed vehicle envelope widths m",
    kind: "numberList",
  },
  {
    id: "callerIndependentSideClearanceM",
    label: "Caller independent side clearance m",
    kind: "numberList",
  },
  {
    id: "callerRequiredConcurrentVehicleCounts",
    label: "Caller required concurrent vehicle counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedVehicleEnvelopeWidthsM.forEach((v) =>
    positive(v, "observedVehicleEnvelopeWidthsM"),
  );
  input.observedRoadUsableWidthsM.forEach((v) =>
    nonnegative(v, "observedRoadUsableWidthsM"),
  );
  input.callerIndependentSideClearanceM.forEach((v) =>
    nonnegative(v, "callerIndependentSideClearanceM"),
  );
  aligned(
    input.observedRoadUsableWidthsM,
    input.observedVehicleEnvelopeWidthsM,
    "observedRoadUsableWidthsM",
  );
  aligned(
    input.observedRoadUsableWidthsM,
    input.callerIndependentSideClearanceM,
    "observedRoadUsableWidthsM",
  );
  aligned(
    input.observedRoadUsableWidthsM,
    input.callerRequiredConcurrentVehicleCounts,
    "observedRoadUsableWidthsM",
  );
  input.callerRequiredConcurrentVehicleCounts.forEach((v) =>
    bounded(v, "vehicles", 0, 128),
  );
  const slots = input.observedRoadUsableWidthsM.map((v, i) =>
    Math.max(
      0,
      Math.floor(
        (v - 2 * input.callerIndependentSideClearanceM[i]) /
          input.observedVehicleEnvelopeWidthsM[i],
      ),
    ),
  );
  return {
    observedWidthVehicleSlotCounts: slots,
    signedConcurrentSlotMargins: slots.map(
      (v, i) => v - input.callerRequiredConcurrentVehicleCounts[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRoadUsableWidthsM: [10, 12],
  observedVehicleEnvelopeWidthsM: [3, 4],
  callerIndependentSideClearanceM: [1, 1],
  callerRequiredConcurrentVehicleCounts: [2, 3],
} satisfies Input;
export const exampleOutput = {
  observedWidthVehicleSlotCounts: [2, 2],
  signedConcurrentSlotMargins: [0, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/haul-road-width",
  title: "Haul Road Width Calculator",
  description:
    "Audit measured usable road width into geometric vehicle-envelope slots after independent edge reserves, inverse inventory audit not existing additive road-width design; no traffic safety. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWidthVehicleSlotCounts",
      label: "Observed width vehicle slot counts",
      kind: "numberList",
    },
    {
      id: "signedConcurrentSlotMargins",
      label: "Signed concurrent slot margins",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRoadUsableWidthsM:
        value.observedRoadUsableWidthsM as readonly number[],
      observedVehicleEnvelopeWidthsM:
        value.observedVehicleEnvelopeWidthsM as readonly number[],
      callerIndependentSideClearanceM:
        value.callerIndependentSideClearanceM as readonly number[],
      callerRequiredConcurrentVehicleCounts:
        value.callerRequiredConcurrentVehicleCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
