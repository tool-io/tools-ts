import { runFrequencyFromMidi } from "../music/frequency-from-midi/tool.js";
import { calculateScientificPitchNotationOctave } from "../music/scientific-pitch-notation-octave/tool.js";
import { runSemitonesBetween } from "../music/semitones-between/tool.js";
import { calculateNoteValueDurationSecondsAtBpm } from "../music/note-value-duration-seconds-at-bpm/tool.js";
import { SimpleToolError, simpleError } from "../core/simple.js";
export type GeneratedMidiPitch = {
  readonly midi: number;
  readonly note: string;
  readonly octave: number;
  readonly frequencyHz: number;
};
export const midiSchema = {
  type: "integer",
  minimum: 0,
  maximum: 127,
} as const;
export const generatedPitchSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midi: midiSchema,
    note: { type: "string", minLength: 2, maxLength: 4 },
    octave: { type: "integer", minimum: -1, maximum: 9 },
    frequencyHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["midi", "note", "octave", "frequencyHz"],
} as const;
export const generatedPitchesSchema = {
  type: "array",
  minItems: 1,
  maxItems: 1024,
  items: generatedPitchSchema,
} as const;
export const generatedPitch = (midi: number): GeneratedMidiPitch => {
  const octave = calculateScientificPitchNotationOctave({
    midiNote: midi,
  }).octave;
  const result = runFrequencyFromMidi({ midi });
  if (!result.ok)
    throw new Error(
      "A validated MIDI note was rejected by the frequency calculator.",
    );
  const pitchClasses = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  return {
    midi,
    note: pitchClasses[midi % 12] + octave,
    octave,
    frequencyHz: result.output.hz,
  };
};
export const generatedInterval = (
  from: GeneratedMidiPitch,
  to: GeneratedMidiPitch,
): number => {
  const result = runSemitonesBetween({ fromNote: from.note, toNote: to.note });
  if (!result.ok)
    throw new Error(
      "Generated scientific pitches were rejected by the interval calculator.",
    );
  return result.output.semitones;
};
export const generatedMusicSeconds = (
  quarterNoteMultiples: number,
  beatsPerMinute: number,
): number => {
  if (quarterNoteMultiples === 0) return 0;
  try {
    const result = calculateNoteValueDurationSecondsAtBpm({
      quarterNoteMultiples,
      beatsPerMinute,
    });
    if (result.durationSeconds <= 0)
      return simpleError(
        "beatsPerMinute",
        "Positive timing intervals must remain representable.",
        "numeric_overflow",
      );
    return result.durationSeconds;
  } catch (error) {
    if (error instanceof SimpleToolError)
      return simpleError(
        "beatsPerMinute",
        "The generated timing must remain positive and finite.",
        "numeric_overflow",
      );
    throw error;
  }
};
