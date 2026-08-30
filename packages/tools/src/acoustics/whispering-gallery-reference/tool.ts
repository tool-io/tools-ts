import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the geometric-acoustics mechanism and limitations of whispering-gallery propagation.",
  entries: {
    mechanism: {
      source: "Geometric acoustics and whispering-gallery literature",
      statement:
        "Concave circular or elliptical boundaries can guide repeated grazing reflections so sound remains concentrated near the perimeter or between geometric foci.",
    },
    limitation: {
      source: "Geometric acoustics",
      statement:
        "The effect depends on wavelength, boundary smoothness, absorption, diffusion, and source and listener position; a dome does not guarantee intelligible whispering.",
    },
    mitigation: {
      source: "Architectural acoustics practice",
      statement:
        "Added diffusion, absorption, segmentation, or altered curvature can reduce strong focused or perimeter propagation, subject to model and field verification.",
    },
  },
  exampleTopic: "mechanism",
  id: "acoustics/whispering-gallery-reference",
  title: "Whispering Gallery Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
