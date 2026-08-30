import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return measurement cautions for low-frequency and tonal leaf-blower noise without assigning annoyance from a device label.",
  entries: {
    tonality: {
      source: "ANSI/ASA S1.13 or ECMA-74 tonal-analysis context",
      statement:
        "Blade-pass and engine components can create prominent tones, but tonality must be established from measured spectra using the specified method.",
    },
    "low-frequency": {
      source: "ISO 1996 environmental-noise assessment context",
      statement:
        "Low-frequency propagation and façade transmission differ from A-weighted broadband behavior, so octave or one-third-octave data may be needed.",
    },
    annoyance: {
      source: "WHO environmental-noise guidance",
      statement:
        "Annoyance depends on level, duration, time, modulation, context, and the affected population; equipment type alone is not a verdict.",
    },
  },
  exampleTopic: "tonality",
  id: "acoustics/leaf-blower-tonality-reference",
  title: "Leaf-Blower Tonality Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
