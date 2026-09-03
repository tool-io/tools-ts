import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSteakTextureTemperature: readonly number[];
  readonly callerSteakTextureTemperatureLower: readonly number[];
  readonly callerSteakTextureTemperatureUpper: readonly number[];
  readonly knownSteakTextureTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSteakTextureTemperature",
    label: "Observed steak texture temperature",
    kind: "numberList",
  },
  {
    id: "callerSteakTextureTemperatureLower",
    label: "Caller steak texture temperature lower",
    kind: "numberList",
  },
  {
    id: "callerSteakTextureTemperatureUpper",
    label: "Caller steak texture temperature upper",
    kind: "numberList",
  },
  {
    id: "knownSteakTextureTemperatureFlags",
    label: "Known steak texture temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedSteakTextureTemperature,
    input.callerSteakTextureTemperatureLower,
    input.callerSteakTextureTemperatureUpper,
    input.knownSteakTextureTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSteakTextureTemperature: [2, 5],
  callerSteakTextureTemperatureLower: [1, 1],
  callerSteakTextureTemperatureUpper: [3, 4],
  knownSteakTextureTemperatureFlags: [1, 0],
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
  id: "cooking/steak-doneness-temperature",
  title: "Cooking Steak Doneness Temperature Calculator",
  description:
    "Observed steak endpoint temperature against caller texture criteria; texture is not food-safety doneness. Unknown indices distinguish zero placeholders from known zero margins. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSteakTextureTemperature:
        value.observedSteakTextureTemperature as readonly number[],
      callerSteakTextureTemperatureLower:
        value.callerSteakTextureTemperatureLower as readonly number[],
      callerSteakTextureTemperatureUpper:
        value.callerSteakTextureTemperatureUpper as readonly number[],
      knownSteakTextureTemperatureFlags:
        value.knownSteakTextureTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
