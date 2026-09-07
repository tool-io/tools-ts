import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedObservedRearingStageHumidity: readonly number[];
  readonly callerObservedRearingStageHumidityLower: readonly number[];
  readonly callerObservedRearingStageHumidityUpper: readonly number[];
  readonly knownObservedRearingStageHumidityFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedObservedRearingStageHumidity",
    label: "Observed observed rearing stage humidity",
    kind: "numberList",
  },
  {
    id: "callerObservedRearingStageHumidityLower",
    label: "Caller observed rearing stage humidity lower",
    kind: "numberList",
  },
  {
    id: "callerObservedRearingStageHumidityUpper",
    label: "Caller observed rearing stage humidity upper",
    kind: "numberList",
  },
  {
    id: "knownObservedRearingStageHumidityFlags",
    label: "Known observed rearing stage humidity flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedObservedRearingStageHumidity,
    input.callerObservedRearingStageHumidityLower,
    input.callerObservedRearingStageHumidityUpper,
    input.knownObservedRearingStageHumidityFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedObservedRearingStageHumidity: [2, 5],
  callerObservedRearingStageHumidityLower: [1, 1],
  callerObservedRearingStageHumidityUpper: [3, 4],
  knownObservedRearingStageHumidityFlags: [1, 0],
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
  id: "sericulture/rearing-room-humidity-stage-lookup",
  title: "Rearing Room Humidity Stage Lookup",
  description:
    "Measured stage-specific rearing-room RH vs independently verified strain/protocol band; not integrated disease-exposure model. Unknown indices distinguish zero placeholders from known zero margins. Caller independently verifies strain, stage, protocol and evidence; not disease-free, biological adequacy or process-safety certification.",
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
      observedObservedRearingStageHumidity:
        value.observedObservedRearingStageHumidity as readonly number[],
      callerObservedRearingStageHumidityLower:
        value.callerObservedRearingStageHumidityLower as readonly number[],
      callerObservedRearingStageHumidityUpper:
        value.callerObservedRearingStageHumidityUpper as readonly number[],
      knownObservedRearingStageHumidityFlags:
        value.knownObservedRearingStageHumidityFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
