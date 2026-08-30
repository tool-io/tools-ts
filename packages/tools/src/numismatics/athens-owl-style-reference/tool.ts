import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return broad diagnostic context for Athens owl tetradrachm style groups without authenticating a coin from style alone.",
  entries: {
    classical: {
      source: "American Numismatic Society and museum collections",
      statement:
        "Classical Athenian owls typically pair Athena’s helmeted head with an owl, olive sprig, crescent, and ΑΘΕ ethnic, within evolving style and fabric.",
    },
    "new-style": {
      source: "British Museum and ANS catalogues",
      statement:
        "Athenian New Style tetradrachms use a distinct later composition with an owl on an amphora and additional magistrate and control information.",
    },
    caution: {
      source: "Ancient coin authentication practice",
      statement:
        "Mass imitation and modern forgery require weight, metal, dies, fabric, provenance, and specialist comparison beyond a style label.",
    },
  },
  exampleTopic: "classical",
  id: "numismatics/athens-owl-style-reference",
  title: "Athens Owl Style Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
