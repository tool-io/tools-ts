import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Explain how occupied-audience equivalent absorption must be selected and documented without publishing a universal per-person table.",
  entries: {
    "occupied-seating": {
      source:
        "ISO 354 reverberation-room method and ISO 3382 room measurement context",
      statement:
        "Audience absorption depends on frequency, seating density, clothing, posture, and seat design; use measurements or a documented design dataset for the actual seating system.",
    },
    "empty-seating": {
      source: "ISO 354 test reports for the selected seating system",
      statement:
        "Empty-seat absorption can approach occupied-seat absorption when chairs are heavily upholstered, but the difference is product- and frequency-specific.",
    },
    "area-method": {
      source:
        "Published room-acoustics design methods; verify the selected dataset",
      statement:
        "Closely spaced audiences are commonly represented by equivalent absorption per occupied seating area rather than multiplying an isolated-person value.",
    },
  },
  exampleTopic: "occupied-seating",
  id: "acoustics/audience-absorption-reference",
  title: "Audience Absorption Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
