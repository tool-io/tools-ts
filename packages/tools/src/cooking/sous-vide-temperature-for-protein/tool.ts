import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSousVideProteinTemperature: readonly number[];
  readonly callerSousVideProteinTemperatureLower: readonly number[];
  readonly callerSousVideProteinTemperatureUpper: readonly number[];
  readonly knownSousVideProteinTemperatureFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedSousVideProteinTemperature",
    label: "Observed sous vide protein temperature",
    kind: "numberList",
  },
  {
    id: "callerSousVideProteinTemperatureLower",
    label: "Caller sous vide protein temperature lower",
    kind: "numberList",
  },
  {
    id: "callerSousVideProteinTemperatureUpper",
    label: "Caller sous vide protein temperature upper",
    kind: "numberList",
  },
  {
    id: "knownSousVideProteinTemperatureFlags",
    label: "Known sous vide protein temperature flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedSousVideProteinTemperature,
    input.callerSousVideProteinTemperatureLower,
    input.callerSousVideProteinTemperatureUpper,
    input.knownSousVideProteinTemperatureFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSousVideProteinTemperature: [2, 5],
  callerSousVideProteinTemperatureLower: [1, 1],
  callerSousVideProteinTemperatureUpper: [3, 4],
  knownSousVideProteinTemperatureFlags: [1, 0],
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
  id: "cooking/sous-vide-temperature-for-protein",
  title: "Cooking Sous Vide Temperature For Protein Calculator",
  description:
    "Observed protein bath/core temperature against independently verified caller method bands, not safe lethality or cook-time prediction. Unknown indices distinguish zero placeholders from known zero margins. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
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
      observedSousVideProteinTemperature:
        value.observedSousVideProteinTemperature as readonly number[],
      callerSousVideProteinTemperatureLower:
        value.callerSousVideProteinTemperatureLower as readonly number[],
      callerSousVideProteinTemperatureUpper:
        value.callerSousVideProteinTemperatureUpper as readonly number[],
      knownSousVideProteinTemperatureFlags:
        value.knownSousVideProteinTemperatureFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
