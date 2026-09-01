import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  ordered,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerPeakUsefulDrawLiters: number;
  readonly observedStoredHotC: number;
  readonly observedColdFeedC: number;
  readonly callerDeliveredWaterC: number;
  readonly callerRecoverableStorageFraction: number;
  readonly callerRecoveryDuringPeakLiters: number;
}>;
export type Output = Readonly<{
  readonly modeledHotStorageFractionOfDraw: number;
  readonly requiredUsableHotStorageLiters: number;
  readonly requiredNominalHotStorageLiters: number;
}>;
const inputFields = [
  {
    id: "callerPeakUsefulDrawLiters",
    label: "Caller peak useful draw liters",
    kind: "number",
  },
  { id: "observedStoredHotC", label: "Observed stored hot c", kind: "number" },
  { id: "observedColdFeedC", label: "Observed cold feed c", kind: "number" },
  {
    id: "callerDeliveredWaterC",
    label: "Caller delivered water c",
    kind: "number",
  },
  {
    id: "callerRecoverableStorageFraction",
    label: "Caller recoverable storage fraction",
    kind: "number",
  },
  {
    id: "callerRecoveryDuringPeakLiters",
    label: "Caller recovery during peak liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerRecoverableStorageFraction,
    "callerRecoverableStorageFraction",
  );
  nonnegative(input.callerPeakUsefulDrawLiters, "callerPeakUsefulDrawLiters");
  nonnegative(
    input.callerRecoveryDuringPeakLiters,
    "callerRecoveryDuringPeakLiters",
  );
  fraction(
    input.callerRecoverableStorageFraction,
    "callerRecoverableStorageFraction",
  );
  if (input.observedStoredHotC <= input.observedColdFeedC)
    simpleError("mix", "Hot storage above cold feed required.");
  ordered(input.observedColdFeedC, input.callerDeliveredWaterC);
  ordered(input.callerDeliveredWaterC, input.observedStoredHotC);
  const f =
      (input.callerDeliveredWaterC - input.observedColdFeedC) /
      (input.observedStoredHotC - input.observedColdFeedC),
    usable = Math.max(
      0,
      input.callerPeakUsefulDrawLiters * f -
        input.callerRecoveryDuringPeakLiters,
    );
  return {
    modeledHotStorageFractionOfDraw: f,
    requiredUsableHotStorageLiters: usable,
    requiredNominalHotStorageLiters:
      usable / input.callerRecoverableStorageFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPeakUsefulDrawLiters: 100,
  observedStoredHotC: 60,
  observedColdFeedC: 20,
  callerDeliveredWaterC: 40,
  callerRecoverableStorageFraction: 0.8,
  callerRecoveryDuringPeakLiters: 10,
} satisfies Input;
export const exampleOutput = {
  modeledHotStorageFractionOfDraw: 0.5,
  requiredUsableHotStorageLiters: 40,
  requiredNominalHotStorageLiters: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/water-heater-sizing",
  title: "Plumbing Water Heater Sizing Calculator",
  description:
    "Budget actual peak useful draw under explicit ideal hot/cold mixing and independent recovery/usable storage; not energy-reheat duration, thermostat instructions or scald/legionella safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledHotStorageFractionOfDraw",
      label: "Modeled hot storage fraction of draw",
      kind: "number",
    },
    {
      id: "requiredUsableHotStorageLiters",
      label: "Required usable hot storage liters",
      kind: "number",
    },
    {
      id: "requiredNominalHotStorageLiters",
      label: "Required nominal hot storage liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerPeakUsefulDrawLiters: value.callerPeakUsefulDrawLiters as number,
      observedStoredHotC: value.observedStoredHotC as number,
      observedColdFeedC: value.observedColdFeedC as number,
      callerDeliveredWaterC: value.callerDeliveredWaterC as number,
      callerRecoverableStorageFraction:
        value.callerRecoverableStorageFraction as number,
      callerRecoveryDuringPeakLiters:
        value.callerRecoveryDuringPeakLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
