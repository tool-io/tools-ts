import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Distinguish apparent field sound-transmission ratings from laboratory STC without offering a false fixed conversion.",
  entries: {
    astc: {
      source: "ASTM E336 and ASTM E413",
      statement:
        "ASTC is an apparent field rating that includes sound transmitted by the separating assembly and associated flanking paths.",
    },
    stc: {
      source: "ASTM E90 and ASTM E413",
      statement:
        "STC is derived from laboratory transmission-loss measurements of a test specimen under ASTM E90 and classified under ASTM E413.",
    },
    caution: {
      source: "ASTM E336",
      statement:
        "There is no universal numeric conversion from STC to ASTC; construction, junctions, workmanship, room conditions, and flanking control determine the field result.",
    },
  },
  exampleTopic: "astc",
  id: "acoustics/astc-field-rating-reference",
  title: "ASTC Field-Rating Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
