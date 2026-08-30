import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Return the meaning and selection cautions of vibration-criterion curves for sensitive facilities.",
  entries: {
    purpose: {
      source:
        "Gordon, Generic Vibration Criteria for Vibration-Sensitive Equipment",
      statement:
        "VC curves classify one-third-octave vibration velocity environments for increasingly vibration-sensitive equipment and activities.",
    },
    selection: {
      source: "Equipment specification and IEST vibration guidance",
      statement:
        "Equipment vendors and process owners should define the applicable curve and frequency range; a facility label alone is insufficient.",
    },
    caution: {
      source: "IEST-RP-CC024 context",
      statement:
        "Curve labels are not structural acceptance by themselves and require calibrated spectral measurements and stated units.",
    },
  },
  exampleTopic: "purpose",
  id: "acoustics/vc-vibration-curve-reference",
  title: "VC Vibration Curve Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
