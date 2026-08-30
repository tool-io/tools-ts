import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return design controls for orchestra shells and overhead reflectors without inventing universal height or angle settings.",
  entries: {
    purpose: {
      source:
        "ISO 3382-1 stage-support context and architectural acoustics practice",
      statement:
        "Shells and canopies return early sound to musicians and the audience and can improve ensemble support when their delay, level, and spectrum are appropriate.",
    },
    geometry: {
      source: "Geometric acoustics",
      statement:
        "Reflector height, tilt, size, mass, and spacing must be derived from source-receiver geometry and wavelength, not selected from one universal angle.",
    },
    safety: {
      source: "Project structural and life-safety requirements",
      statement:
        "Rigging loads, access, fire requirements, and structural certification are separate from the acoustic ray model.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/orchestra-reflector-reference",
  title: "Orchestra Reflector Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
