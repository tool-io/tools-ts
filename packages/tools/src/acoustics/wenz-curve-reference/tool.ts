import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the source-band interpretation and limitations of Wenz ocean-noise curves.",
  entries: {
    shipping: {
      source: "Gordon Wenz, 1962",
      statement:
        "Wenz curves associate low-frequency ambient-noise bands with distant and nearby shipping under representative conditions.",
    },
    wind: {
      source: "Gordon Wenz, 1962",
      statement:
        "Wind-driven surface noise is prominent over a higher frequency region and changes with sea state.",
    },
    caution: {
      source: "Ocean ambient-noise literature",
      statement:
        "The curves are broad empirical envelopes; location, season, propagation, biology, and modern traffic can change observed spectra.",
    },
  },
  exampleTopic: "shipping",
  id: "acoustics/wenz-curve-reference",
  title: "Wenz Curve Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
