import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, textBound } from "../batch-shared.js";
export type Input = Readonly<{ readonly hungarianWord: string }>;
export type Output = Readonly<{
  readonly vowelHarmonyObservation: string;
  readonly backVowelCount: number;
  readonly frontNonneutralVowelCount: number;
  readonly neutralVowelCount: number;
}>;
const inputFields = [
  { id: "hungarianWord", label: "Hungarian word", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const text = textBound(input.hungarianWord).normalize("NFC").toLowerCase();
  if (!/^[a-záéíóöőúüű]+$(?![\s\S])/.test(text))
    simpleError("word", "One bounded Hungarian Latin spelling required.");
  let back = 0,
    front = 0,
    neutral = 0;
  for (const c of text)
    if ("aáoóuú".includes(c)) back++;
    else if ("eöőüű".includes(c)) front++;
    else if ("éií".includes(c)) neutral++;
  return {
    vowelHarmonyObservation:
      back && front
        ? "mixed-back-front"
        : back
          ? "back"
          : front
            ? "front"
            : neutral
              ? "neutral-only"
              : "no-vowel-evidence",
    backVowelCount: back,
    frontNonneutralVowelCount: front,
    neutralVowelCount: neutral,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { hungarianWord: "ház" } satisfies Input;
export const exampleOutput = {
  vowelHarmonyObservation: "back",
  backVowelCount: 1,
  frontNonneutralVowelCount: 0,
  neutralVowelCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/hungarian-vowel-harmony-classifier",
  title: "Hungarian Vowel Harmony Classifier",
  description:
    "Audit observed common Hungarian back/front/neutral spelling classes (é/i/í neutral in this model), retaining mixed and neutral-only ambiguity; lexical antiharmony and suffix choice cannot be inferred solely from this screen.",
  inputs: inputFields,
  outputs: [
    {
      id: "vowelHarmonyObservation",
      label: "Vowel harmony observation",
      kind: "string",
    },
    { id: "backVowelCount", label: "Back vowel count", kind: "number" },
    {
      id: "frontNonneutralVowelCount",
      label: "Front nonneutral vowel count",
      kind: "number",
    },
    { id: "neutralVowelCount", label: "Neutral vowel count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ hungarianWord: value.hungarianWord as string }),
});
export const run = tool.execute;
export default tool;
