import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return documented areas of Lothar Cremer’s acoustics contributions.",
  entries: {
    scope: {
      source: "Technical acoustics histories and Cremer publications",
      statement:
        "Lothar Cremer contributed to technical acoustics, structure-borne sound, wave theory, and room acoustics.",
    },
    books: {
      source: "Cremer, Müller, and Schultz publications",
      statement:
        "Cremer and coauthors produced influential texts on room acoustics and structure-borne sound.",
    },
    caution: {
      source: "Publication record",
      statement:
        "A broad contribution summary should cite a specific publication for any claimed formula or priority.",
    },
  },
  exampleTopic: "scope",
  id: "acoustics/cremer-room-acoustics-history",
  title: "Lothar Cremer Room-Acoustics History",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
