import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedCaramelTemperature: readonly number[];
  readonly callerCaramelTemperatureLower: readonly number[];
  readonly callerCaramelTemperatureUpper: readonly number[];
  readonly knownCaramelTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCaramelTemperature",
    label: "Observed caramel temperature",
    kind: "numberList",
  },
  {
    id: "callerCaramelTemperatureLower",
    label: "Caller caramel temperature lower",
    kind: "numberList",
  },
  {
    id: "callerCaramelTemperatureUpper",
    label: "Caller caramel temperature upper",
    kind: "numberList",
  },
  {
    id: "knownCaramelTemperatureFlags",
    label: "Known caramel temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedCaramelTemperature,
    input.callerCaramelTemperatureLower,
    input.callerCaramelTemperatureUpper,
    input.knownCaramelTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCaramelTemperature: [2, 5],
  callerCaramelTemperatureLower: [1, 1],
  callerCaramelTemperatureUpper: [3, 4],
  knownCaramelTemperatureFlags: [1, 0],
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
  id: "cooking/caramel-temperature-stage",
  title: "Cooking Caramel Temperature Stage Calculator",
  description:
    "Measured caramel temperature against caller matching formulation/pressure stage criteria. Unknown indices distinguish zero placeholders from known zero margins. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedCaramelTemperature:
        value.observedCaramelTemperature as readonly number[],
      callerCaramelTemperatureLower:
        value.callerCaramelTemperatureLower as readonly number[],
      callerCaramelTemperatureUpper:
        value.callerCaramelTemperatureUpper as readonly number[],
      knownCaramelTemperatureFlags:
        value.knownCaramelTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
