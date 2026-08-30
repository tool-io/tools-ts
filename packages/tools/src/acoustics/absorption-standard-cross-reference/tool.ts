import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Distinguish ISO 354 and ASTM C423 report context without inventing a universal result conversion.",
  entries: {
    "common-method": {
      source: "ISO 354:2003 and ASTM C423",
      statement:
        "ISO 354 and ASTM C423 both use reverberation-room decay changes to determine equivalent sound absorption of a specimen.",
    },
    differences: {
      source: "ISO 354 and ASTM C423",
      statement:
        "Room qualification, specimen area, mounting, calculations, averaging, and single-number ratings differ between the standards and editions.",
    },
    caution: {
      source: "ISO 354 and ASTM C423",
      statement:
        "Results should not be converted by a fixed offset; compare test reports with matched specimen and mounting details.",
    },
  },
  exampleTopic: "common-method",
  id: "acoustics/absorption-standard-cross-reference",
  title: "Absorption Standard Cross-Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
