import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedObservedRearingStageTemperature: readonly number[];
  readonly callerObservedRearingStageTemperatureLower: readonly number[];
  readonly callerObservedRearingStageTemperatureUpper: readonly number[];
  readonly knownObservedRearingStageTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedRearingStageTemperature",
    label: "Observed observed rearing stage temperature",
    kind: "numberList",
  },
  {
    id: "callerObservedRearingStageTemperatureLower",
    label: "Caller observed rearing stage temperature lower",
    kind: "numberList",
  },
  {
    id: "callerObservedRearingStageTemperatureUpper",
    label: "Caller observed rearing stage temperature upper",
    kind: "numberList",
  },
  {
    id: "knownObservedRearingStageTemperatureFlags",
    label: "Known observed rearing stage temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedRearingStageTemperature,
    input.callerObservedRearingStageTemperatureLower,
    input.callerObservedRearingStageTemperatureUpper,
    input.knownObservedRearingStageTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedRearingStageTemperature: [2, 5],
  callerObservedRearingStageTemperatureLower: [1, 1],
  callerObservedRearingStageTemperatureUpper: [3, 4],
  knownObservedRearingStageTemperatureFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/rearing-room-temp-stage-lookup",
  title: "Rearing Room Temp Stage Lookup",
  description:
    "Measured stage-specific rearing-room temperature vs independently verified strain/protocol band; no recommended current thermostat setting. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedObservedRearingStageTemperature:
        value.observedObservedRearingStageTemperature as readonly number[],
      callerObservedRearingStageTemperatureLower:
        value.callerObservedRearingStageTemperatureLower as readonly number[],
      callerObservedRearingStageTemperatureUpper:
        value.callerObservedRearingStageTemperatureUpper as readonly number[],
      knownObservedRearingStageTemperatureFlags:
        value.knownObservedRearingStageTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
