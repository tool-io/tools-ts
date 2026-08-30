import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return a cautious evidence framework for naval-sonar and beaked-whale stranding context.",
  entries: {
    association: {
      source: "NOAA and peer-reviewed marine-mammal stranding reviews",
      statement:
        "Some atypical beaked-whale mass strandings have been associated in time and space with naval mid-frequency sonar exercises.",
    },
    mechanism: {
      source: "Peer-reviewed beaked-whale research",
      statement:
        "Proposed pathways include behavioral responses and altered diving, but event-specific causation requires multidisciplinary investigation.",
    },
    caution: {
      source: "NOAA stranding-investigation guidance",
      statement:
        "A sonar occurrence or a stranding alone does not establish causation; necropsy, exposure reconstruction, timing, and alternatives matter.",
    },
  },
  exampleTopic: "association",
  id: "acoustics/sonar-stranding-evidence-reference",
  title: "Sonar Stranding Evidence Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
