import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, mean, bands } from "../shared.js";
export type Input = Readonly<{
  readonly octaveSpeechBandLevelsDb: readonly number[];
  readonly callerMaximumSpeechInterferenceDb: number;
}>;
export type Output = Readonly<{
  readonly fourBandSpeechInterferenceLevelDb: number;
  readonly aboveCallerSpeechInterferenceLimit: boolean;
}>;
const inputFields = [
  {
    id: "octaveSpeechBandLevelsDb",
    label: "Octave speech band levels db",
    kind: "numberList",
  },
  {
    id: "callerMaximumSpeechInterferenceDb",
    label: "Caller maximum speech interference db",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.octaveSpeechBandLevelsDb.length !== 4)
    simpleError(
      "bands",
      "Four already measured 500/1000/2000/4000 Hz octave levels required.",
    );
  return {
    fourBandSpeechInterferenceLevelDb: mean(input.octaveSpeechBandLevelsDb),
    aboveCallerSpeechInterferenceLimit:
      mean(input.octaveSpeechBandLevelsDb) >
      input.callerMaximumSpeechInterferenceDb,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  octaveSpeechBandLevelsDb: [40, 50, 60, 70],
  callerMaximumSpeechInterferenceDb: 50,
} satisfies Input;
export const exampleOutput = {
  fourBandSpeechInterferenceLevelDb: 55,
  aboveCallerSpeechInterferenceLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/speech-interference-level-checker",
  title: "Speech Interference Level Office Privacy Checker",
  description:
    "Audit arithmetic four-octave speech interference level against caller criterion, distinct from logarithmic sound-energy mean; no intelligibility/privacy/acoustic comfort certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "fourBandSpeechInterferenceLevelDb",
      label: "Four band speech interference level db",
      kind: "number",
    },
    {
      id: "aboveCallerSpeechInterferenceLimit",
      label: "Above caller speech interference limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      octaveSpeechBandLevelsDb:
        value.octaveSpeechBandLevelsDb as readonly number[],
      callerMaximumSpeechInterferenceDb:
        value.callerMaximumSpeechInterferenceDb as number,
    }),
});
export const run = tool.execute;
export default tool;
