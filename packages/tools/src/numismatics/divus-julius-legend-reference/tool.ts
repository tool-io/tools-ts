import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the Roman historical context and attribution cautions for DIVVS IVLIVS legends.",
  entries: {
    meaning: {
      source: "Roman Republican Coinage and museum catalogues",
      statement:
        "DIVVS IVLIVS identifies the deified Julius Caesar in Roman legend conventions after his state deification.",
    },
    context: {
      source: "British Museum and American Numismatic Society collections",
      statement:
        "The legend and related comet or portrait types occur in political issues associated with Octavian and later commemorative contexts.",
    },
    caution: {
      source: "Roman numismatic catalog practice",
      statement:
        "Legend fragments must be read with issuer, type, denomination, mint, date, and catalogue reference; the phrase alone does not identify one coin.",
    },
  },
  exampleTopic: "meaning",
  id: "numismatics/divus-julius-legend-reference",
  title: "Divus Julius Legend Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
