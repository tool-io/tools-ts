import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedCheesecakeBathTemperature: readonly number[];
  readonly callerCheesecakeBathTemperatureLower: readonly number[];
  readonly callerCheesecakeBathTemperatureUpper: readonly number[];
  readonly knownCheesecakeBathTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedCheesecakeBathTemperature",
    label: "Observed cheesecake bath temperature",
    kind: "numberList",
  },
  {
    id: "callerCheesecakeBathTemperatureLower",
    label: "Caller cheesecake bath temperature lower",
    kind: "numberList",
  },
  {
    id: "callerCheesecakeBathTemperatureUpper",
    label: "Caller cheesecake bath temperature upper",
    kind: "numberList",
  },
  {
    id: "knownCheesecakeBathTemperatureFlags",
    label: "Known cheesecake bath temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedCheesecakeBathTemperature,
    input.callerCheesecakeBathTemperatureLower,
    input.callerCheesecakeBathTemperatureUpper,
    input.knownCheesecakeBathTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCheesecakeBathTemperature: [2, 5],
  callerCheesecakeBathTemperatureLower: [1, 1],
  callerCheesecakeBathTemperatureUpper: [3, 4],
  knownCheesecakeBathTemperatureFlags: [1, 0],
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
  id: "cooking/cheesecake-water-bath-temperature",
  title: "Cooking Cheesecake Water Bath Temperature Calculator",
  description:
    "Measured cheesecake bath temperature against caller process bands, no texture/safety guarantee. Unknown indices distinguish zero placeholders from known zero margins. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedCheesecakeBathTemperature:
        value.observedCheesecakeBathTemperature as readonly number[],
      callerCheesecakeBathTemperatureLower:
        value.callerCheesecakeBathTemperatureLower as readonly number[],
      callerCheesecakeBathTemperatureUpper:
        value.callerCheesecakeBathTemperatureUpper as readonly number[],
      knownCheesecakeBathTemperatureFlags:
        value.knownCheesecakeBathTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
