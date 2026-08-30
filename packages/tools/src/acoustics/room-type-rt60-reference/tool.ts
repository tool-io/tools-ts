import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return cautious room-type reverberation-time design context without asserting a universal numeric target.",
  entries: {
    "speech-room": {
      source:
        "ISO 3382 measurement scope and established room-acoustics design practice",
      statement:
        "Speech-focused rooms generally use shorter reverberation times than unamplified music rooms; select the project target from room volume, occupancy, language, and the governing brief.",
    },
    "music-room": {
      source: "ISO 3382-1 and project-specific acoustic design criteria",
      statement:
        "Concert and rehearsal targets depend strongly on room volume, ensemble, occupancy, and repertoire; a room-type label alone does not determine one correct RT value.",
    },
    "recording-room": {
      source: "EBU Tech 3276 and project-specific studio criteria",
      statement:
        "Recording spaces often seek controlled, frequency-dependent decay, but control rooms, live rooms, and booths require different targets.",
    },
  },
  exampleTopic: "speech-room",
  id: "acoustics/room-type-rt60-reference",
  title: "Room-Type RT60 Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
