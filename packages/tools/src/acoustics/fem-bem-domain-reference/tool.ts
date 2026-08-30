import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Compare low-frequency acoustic finite- and boundary-element method domains without selecting a solver from frequency alone.",
  entries: {
    fem: {
      source: "Numerical acoustics literature",
      statement:
        "FEM discretizes the modeled volume and is well suited to bounded domains, heterogeneous media, and coupled structural-acoustic models.",
    },
    bem: {
      source: "Numerical acoustics literature",
      statement:
        "BEM discretizes boundaries and can represent unbounded exterior domains efficiently, while producing dense systems in common formulations.",
    },
    caution: {
      source: "Numerical acoustics literature",
      statement:
        "Mesh resolution, boundary conditions, conditioning, coupling, geometry, and available solvers determine suitability; neither method is universally superior.",
    },
  },
  exampleTopic: "fem",
  id: "acoustics/fem-bem-domain-reference",
  title: "FEM and BEM Domain Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
