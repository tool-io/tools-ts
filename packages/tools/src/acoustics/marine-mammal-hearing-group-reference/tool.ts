import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the purpose and limitations of regulatory marine-mammal hearing groups.",
  entries: {
    purpose: {
      source: "NOAA Fisheries technical guidance",
      statement:
        "Hearing groups organize species with broadly similar hearing sensitivity for frequency weighting and acoustic-exposure assessment.",
    },
    groups: {
      source: "NOAA Fisheries technical guidance",
      statement:
        "Current guidance distinguishes multiple cetacean and pinniped hearing groups; names and weighting parameters depend on the cited guidance edition.",
    },
    caution: {
      source: "NOAA Fisheries technical guidance",
      statement:
        "A group weighting is not an individual audiogram and does not replace species, context, duration, or exposure-level analysis.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/marine-mammal-hearing-group-reference",
  title: "Marine Mammal Hearing Group Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
