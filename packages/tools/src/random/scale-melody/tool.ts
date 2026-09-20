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
  generatedPitchesSchema,
  midiSchema,
  type GeneratedMidiPitch,
} from "../music-sequence-construction.js";

export type ScaleMelodyInput = {
  readonly count: number;
  readonly tonicPitchClass: number;
  readonly scaleOffsets: readonly number[];
  readonly minimumOctave: number;
  readonly maximumOctave: number;
  readonly seed?: number;
};
export type ScaleMelodyOutput = {
  readonly availableMidi: readonly number[];
  readonly notes: readonly GeneratedMidiPitch[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1, maximum: 1024 },
    tonicPitchClass: { type: "integer", minimum: 0, maximum: 11 },
    scaleOffsets: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: { type: "integer", minimum: 0, maximum: 11 },
    },
    minimumOctave: { type: "integer", minimum: -1, maximum: 9 },
    maximumOctave: { type: "integer", minimum: -1, maximum: 9 },
    seed: generatorSeedSchema,
  },
  required: [
    "count",
    "tonicPitchClass",
    "scaleOffsets",
    "minimumOctave",
    "maximumOctave",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMidi: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: midiSchema,
    },
    notes: generatedPitchesSchema,
    randomness: generatorReplaySchema,
  },
  required: ["availableMidi", "notes", "randomness"],
} as const;

const isInput = (input: unknown): input is ScaleMelodyInput =>
  matchesModelInput(input, inputSchema);
export const calculateScaleMelody = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ScaleMelodyOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumOctave < input.minimumOctave)
      simpleError(
        "maximumOctave",
        "Octave limits must be ordered.",
        "invalid_octave_range",
      );
    if (new Set(input.scaleOffsets).size !== input.scaleOffsets.length)
      simpleError(
        "scaleOffsets",
        "Scale offsets must be distinct pitch classes.",
        "duplicate_scale_offsets",
      );
    const offsets = new Set(input.scaleOffsets),
      availableMidi = Array.from({ length: 128 }, (_, midi) => midi).filter(
        (midi) => {
          const octave = Math.floor(midi / 12) - 1;
          return (
            octave >= input.minimumOctave &&
            octave <= input.maximumOctave &&
            offsets.has(((midi % 12) - input.tonicPitchClass + 12) % 12)
          );
        },
      );
    if (!availableMidi.length)
      simpleError(
        "scaleOffsets",
        "No selected pitch class fits the octave limits and MIDI range.",
        "empty_pitch_pool",
      );
    const random = createGeneratorRandom(input.seed, context),
      notes = Array.from({ length: input.count }, () =>
        generatedPitch(random.pick(availableMidi)),
      );
    return toolSuccess({
      availableMidi,
      notes,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const scaleMelodyExample = {
  input: {
    count: 6,
    tonicPitchClass: 0,
    scaleOffsets: [0, 2, 4, 5, 7, 9, 11],
    minimumOctave: 4,
    maximumOctave: 4,
    seed: 42,
  },
  output: {
    availableMidi: [60, 62, 64, 65, 67, 69, 71],
    notes: [
      {
        midi: 67,
        note: "G4",
        octave: 4,
        frequencyHz: 391.99543598174927,
      },
      {
        midi: 65,
        note: "F4",
        octave: 4,
        frequencyHz: 349.2282314330039,
      },
      {
        midi: 69,
        note: "A4",
        octave: 4,
        frequencyHz: 440,
      },
      {
        midi: 67,
        note: "G4",
        octave: 4,
        frequencyHz: 391.99543598174927,
      },
      {
        midi: 62,
        note: "D4",
        octave: 4,
        frequencyHz: 293.6647679174076,
      },
      {
        midi: 65,
        note: "F4",
        octave: 4,
        frequencyHz: 349.2282314330039,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ScaleMelodyInput, ScaleMelodyOutput>;
export const scaleMelodyTool = createModelDefinition<
  ScaleMelodyInput,
  ScaleMelodyOutput
>({
  id: "random/scale-melody",
  title: "Random Scale-Constrained Melody Generator",
  description:
    "Generate exact-count independent MIDI pitches with replacement from supplied tonic-relative pitch classes and scientific octave bounds, delegating octave and A4=440 Hz frequency metadata; no rhythm, key spelling or musical-quality claim.",
  inputSchema,
  outputSchema,
  execute: calculateScaleMelody,
});
export const runScaleMelody = scaleMelodyTool.execute;
export default scaleMelodyTool;
