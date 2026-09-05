import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  integer,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyCountedPolysyllabicWords: number;
  readonly observedSampleSentenceCount: number;
}>;
export type Output = Readonly<{
  readonly smogGradeProxy: number;
  readonly thirtySentenceSampleFloorReached: boolean;
}>;
const inputFields = [
  {
    id: "independentlyCountedPolysyllabicWords",
    label: "Independently counted polysyllabic words",
    kind: "number",
  },
  {
    id: "observedSampleSentenceCount",
    label: "Observed sample sentence count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedSampleSentenceCount, "observedSampleSentenceCount");
  nonnegative(
    input.independentlyCountedPolysyllabicWords,
    "independentlyCountedPolysyllabicWords",
  );
  integer(input.independentlyCountedPolysyllabicWords, "words");
  integer(input.observedSampleSentenceCount, "sentences");
  return {
    smogGradeProxy:
      1.043 *
        Math.sqrt(
          (input.independentlyCountedPolysyllabicWords * 30) /
            input.observedSampleSentenceCount,
        ) +
      3.1291,
    thirtySentenceSampleFloorReached: input.observedSampleSentenceCount >= 30,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyCountedPolysyllabicWords: 30,
  observedSampleSentenceCount: 30,
} satisfies Input;
export const exampleOutput = {
  smogGradeProxy: 8.841846274778883,
  thirtySentenceSampleFloorReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/smog-grade-level-check-calculator",
  title: "Smog Grade Level Check Calculator",
  description:
    "SMOG grade proxy with independently counted three-or-more-syllable words and explicit observed sample length; flags short sample, not reading-age diagnosis or syntax/word segmentation. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
  inputs: inputFields,
  outputs: [
    { id: "smogGradeProxy", label: "Smog grade proxy", kind: "number" },
    {
      id: "thirtySentenceSampleFloorReached",
      label: "Thirty sentence sample floor reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyCountedPolysyllabicWords:
        value.independentlyCountedPolysyllabicWords as number,
      observedSampleSentenceCount: value.observedSampleSentenceCount as number,
    }),
});
export const run = tool.execute;
export default tool;
