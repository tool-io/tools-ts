import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the geometric construction and limitations of the room-acoustic image-source method.",
  entries: {
    construction: {
      source: "Allen and Berkley, JASA, 1979",
      statement:
        "The image-source method mirrors a source across room boundaries so specular reflection paths can be represented as straight paths to virtual sources.",
    },
    order: {
      source: "Geometric room-acoustics literature",
      statement:
        "Higher reflection order increases the number of image sources; pruning and time or energy limits control computation.",
    },
    caution: {
      source: "Geometric room-acoustics literature",
      statement:
        "The basic method assumes specular reflection and geometric acoustics; diffraction, scattering, and wave effects require additional models.",
    },
  },
  exampleTopic: "construction",
  id: "acoustics/image-source-method-reference",
  title: "Image-Source Method Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
