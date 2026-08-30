import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Explain the revised balanced-noise-criterion method and its relationship to other room-noise ratings.",
  entries: {
    purpose: {
      source: "ANSI/ASA S12.2 and Beranek room-noise literature",
      statement:
        "NCB was developed to rate broadband room noise while identifying spectra with excessive low- or high-frequency content.",
    },
    descriptor: {
      source: "ANSI/ASA S12.2",
      statement:
        "A complete NCB result includes the rating procedure and any spectral-quality designation rather than only one broadband level.",
    },
    caution: {
      source: "ANSI/ASA S12.2 and ASHRAE guidance",
      statement:
        "NC, NCB, RC, and dBA use different procedures and must not be converted by a universal fixed offset.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/balanced-noise-criterion-reference",
  title: "Balanced Noise Criterion Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
