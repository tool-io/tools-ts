import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return a dated map of selected Acoustical Society of America technical-committee scopes.",
  entries: {
    architectural: {
      source:
        "Acoustical Society of America committee pages, accessed 2026-09-24",
      statement:
        "The Technical Committee on Architectural Acoustics addresses generation, propagation, and perception of sound in and around buildings.",
    },
    ocean: {
      source:
        "Acoustical Society of America committee pages, accessed 2026-09-24",
      statement:
        "The Technical Committee on Acoustical Oceanography addresses sound as a tool and phenomenon in ocean science.",
    },
    caution: {
      source: "Acoustical Society of America",
      statement:
        "Committee names and scopes can change; consult the current ASA technical-council directory for governance or submission decisions.",
    },
  },
  exampleTopic: "architectural",
  id: "acoustics/asa-committee-scope-reference",
  title: "ASA Committee Scope Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
