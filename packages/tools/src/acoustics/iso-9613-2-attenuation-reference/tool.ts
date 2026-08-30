import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the principal outdoor sound-propagation attenuation terms and method cautions.",
  entries: {
    terms: {
      source: "ISO 9613-2",
      statement:
        "The ISO 9613-2 engineering method combines geometrical divergence, atmospheric absorption, ground effect, barrier, and applicable miscellaneous attenuation terms.",
    },
    meteorology: {
      source: "ISO 9613-2",
      statement:
        "The method uses specified favorable-propagation assumptions and a separate approach for long-term average level under its stated scope.",
    },
    caution: {
      source: "ISO 9613-2",
      statement:
        "Terrain, weather, source directivity, reflections, and edition-specific rules must be modeled explicitly; the five term names are not a complete prediction.",
    },
  },
  exampleTopic: "terms",
  id: "acoustics/iso-9613-2-attenuation-reference",
  title: "ISO 9613-2 Attenuation Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
