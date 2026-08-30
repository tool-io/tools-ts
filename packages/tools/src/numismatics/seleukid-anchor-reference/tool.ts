import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the evidentiary role and limitations of the Seleukid anchor device.",
  entries: {
    "dynastic-symbol": {
      source: "Seleucid Coins catalogues and major museum collections",
      statement:
        "The anchor became a prominent Seleukid dynastic badge and appears as a principal type or control device on many issues.",
    },
    variation: {
      source: "Seleucid Coins catalogues",
      statement:
        "Orientation, placement, accompanying legend, monograms, denomination, ruler, and mint vary, so the anchor alone does not date an issue.",
    },
    caution: {
      source: "Ancient numismatic catalog practice",
      statement:
        "Other issuers and imitations can use related devices; attribution requires the complete type and catalogue reference.",
    },
  },
  exampleTopic: "dynastic-symbol",
  id: "numismatics/seleukid-anchor-reference",
  title: "Seleukid Anchor Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
