import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the purpose and key reporting cautions of the ASTM reverberation-room absorption method.",
  entries: {
    purpose: {
      source: "ASTM C423",
      statement:
        "ASTM C423 determines sound absorption and sound-absorption coefficients of materials by comparing reverberation-room decay with and without a specimen.",
    },
    mounting: {
      source: "ASTM C423",
      statement:
        "Specimen area, mounting designation, edge treatment, room qualification, and frequency-band results are part of interpreting a report.",
    },
    caution: {
      source: "ASTM C423",
      statement:
        "Reverberation-room coefficients can exceed 1 because of test and edge effects and are not direct normal-incidence material constants.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/astm-c423-method-reference",
  title: "ASTM C423 Method Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
