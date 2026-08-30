import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the pitch mechanism and limitations of the missing-fundamental phenomenon.",
  entries: {
    phenomenon: {
      source: "Pitch-perception literature",
      statement:
        "A harmonic complex can evoke a pitch at the absent fundamental frequency when the remaining partials support a common periodicity.",
    },
    "not-difference-tone": {
      source: "Pitch-perception literature",
      statement:
        "The residue pitch need not be explained by physical energy at the fundamental or by a single nonlinear difference tone.",
    },
    caution: {
      source: "Pitch-perception literature",
      statement:
        "Pitch salience depends on harmonic number, spacing, phase, bandwidth, level, and listener; an arbitrary set of frequencies may not evoke it.",
    },
  },
  exampleTopic: "phenomenon",
  id: "acoustics/missing-fundamental-reference",
  title: "Missing Fundamental Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
