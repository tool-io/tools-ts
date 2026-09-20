import type { ToolExample } from "../../core/example.js";
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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  generatedPitch,
  generatedInterval,
  generatedPitchesSchema,
  midiSchema,
  type GeneratedMidiPitch,
} from "../music-sequence-construction.js";

export type IntervalMelodyInput = {
  readonly count: number;
  readonly minimumMidi: number;
  readonly maximumMidi: number;
  readonly startingMidi: number;
  readonly maximumStepSemitones: number;
  readonly seed?: number;
};
export type IntervalMelodyOutput = {
  readonly notes: readonly GeneratedMidiPitch[];
  readonly signedIntervals: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 1024 },
    minimumMidi: midiSchema,
    maximumMidi: midiSchema,
    startingMidi: midiSchema,
    maximumStepSemitones: { type: "integer", minimum: 0, maximum: 127 },
    seed: generatorSeedSchema,
  },
  required: [
    "count",
    "minimumMidi",
    "maximumMidi",
    "startingMidi",
    "maximumStepSemitones",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notes: generatedPitchesSchema,
    signedIntervals: {
      type: "array",
      maxItems: 1023,
      items: { type: "integer", minimum: -127, maximum: 127 },
    },
    randomness: generatorReplaySchema,
  },
  required: ["notes", "signedIntervals", "randomness"],
} as const;

const isInput = (input: unknown): input is IntervalMelodyInput =>
  matchesModelInput(input, inputSchema);
export const calculateIntervalMelody = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<IntervalMelodyOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumMidi < input.minimumMidi)
      simpleError(
        "maximumMidi",
        "Pitch limits must be ordered.",
        "invalid_pitch_range",
      );
    if (
      input.startingMidi < input.minimumMidi ||
      input.startingMidi > input.maximumMidi
    )
      simpleError(
        "startingMidi",
        "Starting pitch must fit the selected range.",
        "start_outside_range",
      );
    const random = createGeneratorRandom(input.seed, context),
      notes = [generatedPitch(input.startingMidi)],
      signedIntervals: number[] = [];
    while (notes.length < input.count) {
      const previous = notes[notes.length - 1],
        midi = random.integer(
          Math.max(
            input.minimumMidi,
            previous.midi - input.maximumStepSemitones,
          ),
          Math.min(
            input.maximumMidi,
            previous.midi + input.maximumStepSemitones,
          ),
        );
      const next = generatedPitch(midi);
      notes.push(next);
      signedIntervals.push(generatedInterval(previous, next));
    }
    return toolSuccess({
      notes,
      signedIntervals,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const intervalMelodyExample = {
  input: {
    count: 7,
    minimumMidi: 60,
    maximumMidi: 72,
    startingMidi: 67,
    maximumStepSemitones: 4,
    seed: 42,
  },
  output: {
    notes: [
      {
        midi: 67,
        note: "G4",
        octave: 4,
        frequencyHz: 391.99543598174927,
      },
      {
        midi: 68,
        note: "G#4",
        octave: 4,
        frequencyHz: 415.3046975799451,
      },
      {
        midi: 68,
        note: "G#4",
        octave: 4,
        frequencyHz: 415.3046975799451,
      },
      {
        midi: 71,
        note: "B4",
        octave: 4,
        frequencyHz: 493.8833012561241,
      },
      {
        midi: 71,
        note: "B4",
        octave: 4,
        frequencyHz: 493.8833012561241,
      },
      {
        midi: 68,
        note: "G#4",
        octave: 4,
        frequencyHz: 415.3046975799451,
      },
      {
        midi: 68,
        note: "G#4",
        octave: 4,
        frequencyHz: 415.3046975799451,
      },
    ],
    signedIntervals: [1, 0, 3, 0, -3, 0],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<IntervalMelodyInput, IntervalMelodyOutput>;
export const intervalMelodyTool = createModelDefinition<
  IntervalMelodyInput,
  IntervalMelodyOutput
>({
  id: "random/interval-melody",
  title: "Random Bounded-Interval Melody Generator",
  description:
    "Generate a MIDI melody from an explicit starting pitch with uniform local choices including repeated notes inside a pitch range and maximum semitone step, delegating frequency and signed interval answers; not uniform over complete melodies.",
  inputSchema,
  outputSchema,
  execute: calculateIntervalMelody,
});
export const runIntervalMelody = intervalMelodyTool.execute;
export default intervalMelodyTool;
