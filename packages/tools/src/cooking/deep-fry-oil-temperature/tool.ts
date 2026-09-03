import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedFryOilTemperature: readonly number[];
  readonly callerFryOilTemperatureLower: readonly number[];
  readonly callerFryOilTemperatureUpper: readonly number[];
  readonly knownFryOilTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFryOilTemperature",
    label: "Observed fry oil temperature",
    kind: "numberList",
  },
  {
    id: "callerFryOilTemperatureLower",
    label: "Caller fry oil temperature lower",
    kind: "numberList",
  },
  {
    id: "callerFryOilTemperatureUpper",
    label: "Caller fry oil temperature upper",
    kind: "numberList",
  },
  {
    id: "knownFryOilTemperatureFlags",
    label: "Known fry oil temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedFryOilTemperature,
    input.callerFryOilTemperatureLower,
    input.callerFryOilTemperatureUpper,
    input.knownFryOilTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFryOilTemperature: [2, 5],
  callerFryOilTemperatureLower: [1, 1],
  callerFryOilTemperatureUpper: [3, 4],
  knownFryOilTemperatureFlags: [1, 0],
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
  id: "cooking/deep-fry-oil-temperature",
  title: "Cooking Deep Fry Oil Temperature Calculator",
  description:
    "Measured oil temperature against independently applicable process bands; not oil fire safety or food endpoint. Unknown indices distinguish zero placeholders from known zero margins. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedFryOilTemperature:
        value.observedFryOilTemperature as readonly number[],
      callerFryOilTemperatureLower:
        value.callerFryOilTemperatureLower as readonly number[],
      callerFryOilTemperatureUpper:
        value.callerFryOilTemperatureUpper as readonly number[],
      knownFryOilTemperatureFlags:
        value.knownFryOilTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
