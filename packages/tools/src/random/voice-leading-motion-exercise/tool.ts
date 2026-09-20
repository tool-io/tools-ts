import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculate as motion } from "../../music/voice-leading-motion-classifier/tool.js";
import { calculate as consonance } from "../../music/counterpoint-consonance-classifier/tool.js";
import {
  objectSchema,
  arraySchema,
  countSchema,
  rangeSchema,
  drawInteger,
  orderedRange,
  ensureOutput,
  type NumericRange,
} from "../m250-css-music-space-support.js";
export type VoiceLeadingMotionExerciseInput = {
  readonly count: number;
  readonly midiRange: NumericRange;
  readonly maximumLeapSemitones: number;
  readonly lowerVoiceIsBass: boolean;
  readonly seed?: number;
};
export type VoiceIntervalEvidence = {
  readonly lowerScientificNote: string;
  readonly upperScientificNote: string;
  readonly counterpointIntervalClass: string;
  readonly consonantUnderTwoVoiceConvention: boolean;
  readonly spelledSimpleIntervalNumber: number;
};
export type VoiceLeadingMotionExerciseOutput = {
  readonly exercises: readonly {
    readonly firstVoiceMidiPair: readonly number[];
    readonly secondVoiceMidiPair: readonly number[];
    readonly twoVoiceMotionClass: string;
    readonly firstVoiceSignedMotion: number;
    readonly secondVoiceSignedMotion: number;
    readonly voiceCrossingObserved: boolean;
    readonly before: VoiceIntervalEvidence;
    readonly after: VoiceIntervalEvidence;
  }[];
  readonly randomness: GeneratorReplay;
};
const midi = { type: "integer", minimum: 0, maximum: 127 } as const,
  pair = arraySchema(midi, 2, 2);
const interval = objectSchema({
  lowerScientificNote: { type: "string" },
  upperScientificNote: { type: "string" },
  counterpointIntervalClass: { type: "string" },
  consonantUnderTwoVoiceConvention: { type: "boolean" },
  spelledSimpleIntervalNumber: { type: "integer" },
});
export const inputSchema = objectSchema(
  {
    count: countSchema(64),
    midiRange: rangeSchema(midi),
    maximumLeapSemitones: countSchema(24, 0),
    lowerVoiceIsBass: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  ["count", "midiRange", "maximumLeapSemitones", "lowerVoiceIsBass"],
);
export const outputSchema = objectSchema({
  exercises: arraySchema(
    objectSchema({
      firstVoiceMidiPair: pair,
      secondVoiceMidiPair: pair,
      twoVoiceMotionClass: { type: "string" },
      firstVoiceSignedMotion: { type: "integer" },
      secondVoiceSignedMotion: { type: "integer" },
      voiceCrossingObserved: { type: "boolean" },
      before: interval,
      after: interval,
    }),
    64,
    1,
  ),
  randomness: generatorReplaySchema,
});
const note = (midi: number): string =>
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][midi % 12] +
  (Math.floor(midi / 12) - 1);
const isInput = (value: unknown): value is VoiceLeadingMotionExerciseInput =>
  matchesModelInput(value, inputSchema);
export const calculateVoiceLeadingMotionExercise = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<VoiceLeadingMotionExerciseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedRange(input.midiRange, "midiRange");
    if (input.midiRange.maximum - input.midiRange.minimum > 48)
      simpleError(
        "midiRange",
        "The spelled-interval core supports at most four octaves in this sharp-spelled subset.",
        "unsupported_interval_span",
      );
    const random = createGeneratorRandom(input.seed, context);
    const classify = (a: number, b: number): VoiceIntervalEvidence => {
      const lowerScientificNote = note(Math.min(a, b)),
        upperScientificNote = note(Math.max(a, b));
      return {
        lowerScientificNote,
        upperScientificNote,
        ...consonance({
          lowerScientificNote,
          upperScientificNote,
          lowerVoiceIsBass: input.lowerVoiceIsBass,
        }),
      };
    };
    const exercises = Array.from({ length: input.count }, () => {
      const a = drawInteger(input.midiRange, random, "midiRange"),
        c = drawInteger(input.midiRange, random, "midiRange");
      const next = (start: number) =>
        random.integer(
          Math.max(input.midiRange.minimum, start - input.maximumLeapSemitones),
          Math.min(input.midiRange.maximum, start + input.maximumLeapSemitones),
        );
      const b = next(a),
        d = next(c),
        firstVoiceMidiPair = [a, b],
        secondVoiceMidiPair = [c, d];
      return {
        firstVoiceMidiPair,
        secondVoiceMidiPair,
        ...motion({ firstVoiceMidiPair, secondVoiceMidiPair }),
        before: classify(a, c),
        after: classify(b, d),
      };
    });
    return toolSuccess(
      ensureOutput(
        { exercises, randomness: generatorReplay(input.seed, context) },
        outputSchema,
      ),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const voiceLeadingMotionExerciseExample = {
  input: {
    count: 1,
    midiRange: {
      minimum: 60,
      maximum: 72,
    },
    maximumLeapSemitones: 2,
    lowerVoiceIsBass: true,
    seed: 42,
  },
  output: {
    exercises: [
      {
        firstVoiceMidiPair: [67, 69],
        secondVoiceMidiPair: [65, 66],
        twoVoiceMotionClass: "similar",
        firstVoiceSignedMotion: 2,
        secondVoiceSignedMotion: 1,
        voiceCrossingObserved: false,
        before: {
          lowerScientificNote: "F4",
          upperScientificNote: "G4",
          counterpointIntervalClass: "dissonance",
          consonantUnderTwoVoiceConvention: false,
          spelledSimpleIntervalNumber: 2,
        },
        after: {
          lowerScientificNote: "F#4",
          upperScientificNote: "A4",
          counterpointIntervalClass: "imperfect-consonance",
          consonantUnderTwoVoiceConvention: true,
          spelledSimpleIntervalNumber: 3,
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  VoiceLeadingMotionExerciseInput,
  VoiceLeadingMotionExerciseOutput
>;
export const voiceLeadingMotionExerciseTool = createModelDefinition<
  VoiceLeadingMotionExerciseInput,
  VoiceLeadingMotionExerciseOutput
>({
  id: "random/voice-leading-motion-exercise",
  title: "Random Voice Leading Motion Exercise Generator",
  description:
    "Generate bounded two-voice MIDI transitions with sharp-spelled interval prompts and delegated motion and consonance classifications.",
  inputSchema,
  outputSchema,
  execute: calculateVoiceLeadingMotionExercise,
});
export const runVoiceLeadingMotionExercise =
  voiceLeadingMotionExerciseTool.execute;
export default voiceLeadingMotionExerciseTool;
