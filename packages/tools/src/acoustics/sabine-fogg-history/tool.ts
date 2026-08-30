import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return sourced milestones in Sabine’s Fogg Lecture Hall work and reverberation research.",
  entries: {
    assignment: {
      source: "Harvard historical accounts and Sabine biographies",
      statement:
        "Harvard asked Wallace Clement Sabine to investigate the poor acoustics of the Fogg Art Museum lecture room in the 1890s.",
    },
    method: {
      source: "Sabine, Collected Papers on Acoustics",
      statement:
        "Sabine compared decay using organ-pipe sound and removable seat cushions, relating reverberation to room volume and absorption.",
    },
    legacy: {
      source: "Acoustical Society of America historical accounts",
      statement:
        "The work led to the reverberation-time relation and the sabin unit, but modern room assessment uses additional metrics.",
    },
  },
  exampleTopic: "assignment",
  id: "acoustics/sabine-fogg-history",
  title: "Sabine and Fogg Lecture Hall History",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
