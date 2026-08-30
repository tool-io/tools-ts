import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return broad vocalization-band context without treating species as fixed-frequency signal generators.",
  entries: {
    baleen: {
      source: "NOAA Fisheries species and acoustics resources",
      statement:
        "Many baleen-whale calls emphasize low frequencies, but repertoire and band vary substantially by species and call type.",
    },
    toothed: {
      source: "NOAA Fisheries species and acoustics resources",
      statement:
        "Toothed whales commonly use whistles and high-frequency echolocation clicks, with species-specific bandwidth and source levels.",
    },
    caution: {
      source: "NOAA passive-acoustic monitoring guidance",
      statement:
        "Species identification requires call structure, location, season, behavior, and validated detectors, not frequency alone.",
    },
  },
  exampleTopic: "baleen",
  id: "acoustics/whale-vocalization-band-reference",
  title: "Whale Vocalization Band Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
