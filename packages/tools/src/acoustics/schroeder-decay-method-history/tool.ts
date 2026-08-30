import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the historical contribution and scope of Schroeder’s integrated-impulse-response decay method.",
  entries: {
    method: {
      source:
        "Manfred R. Schroeder, Journal of the Acoustical Society of America, 1965",
      statement:
        "Schroeder showed that backward integration of a squared impulse response yields the ensemble-averaged decay curve used for reverberation analysis.",
    },
    benefit: {
      source: "ISO 3382 measurement context",
      statement:
        "The method avoids repeated interrupted-noise decays when a suitable impulse response and dynamic range are available.",
    },
    caution: {
      source: "JASA publication record",
      statement:
        "The commonly cited integrated-decay paper is from 1965, so a “1962 frequency curve” label should not be substituted for it.",
    },
  },
  exampleTopic: "method",
  id: "acoustics/schroeder-decay-method-history",
  title: "Schroeder Decay Method History",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
