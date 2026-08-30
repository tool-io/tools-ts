import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return cautious taxonomy context for square and round Greco-Bactrian or Indo-Greek silver.",
  entries: {
    shape: {
      source: "British Museum and ANS collections",
      statement:
        "Some Indo-Greek silver denominations use square flans, while many Greco-Bactrian and Indo-Greek issues are round; shape is not a complete regional classifier.",
    },
    legends: {
      source: "British Museum collection and Indo-Greek catalogues",
      statement:
        "Bilingual Greek and Kharoshthi legends are common on many Indo-Greek issues and provide ruler and epithet evidence.",
    },
    caution: {
      source: "Indo-Greek numismatic literature",
      statement:
        "Metal, denomination, ruler, mint, chronology, overstrikes, and imitations require catalogue-level attribution.",
    },
  },
  exampleTopic: "shape",
  id: "numismatics/bactrian-indo-greek-silver-reference",
  title: "Bactrian and Indo-Greek Silver Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
