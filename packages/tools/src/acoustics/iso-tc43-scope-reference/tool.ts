import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return a dated high-level scope of ISO/TC 43 and its acoustics subcommittees.",
  entries: {
    tc43: {
      source: "ISO/TC 43 public committee page, accessed 2026-09-24",
      statement:
        "ISO/TC 43 develops standardization in acoustics, including methods of measurement, assessment, and related terminology.",
    },
    sc1: {
      source: "ISO public committee pages, accessed 2026-09-24",
      statement: "ISO/TC 43/SC 1 covers noise within the committee structure.",
    },
    caution: {
      source: "ISO public committee pages",
      statement:
        "Working-group assignments and active projects change; use the ISO committee page rather than a static lookup for current membership or work items.",
    },
  },
  exampleTopic: "tc43",
  id: "acoustics/iso-tc43-scope-reference",
  title: "ISO TC 43 Scope Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
